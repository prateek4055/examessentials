// Cart utility functions for managing cart items and combo discounts

export interface CartItem {
  productId: string;
  addedAt: string;
}

export interface ComboConfig {
  id: string;
  label: string;
  subjects: string[];
  price: number;
  originalPrice: number;
}

// All available combos
export const comboConfigs: ComboConfig[] = [
  { id: "phy-chem", label: "Physics + Chemistry", subjects: ["Physics", "Chemistry"], price: 99, originalPrice: 149 },
  { id: "pcm", label: "PCM Combo", subjects: ["Physics", "Chemistry", "Mathematics"], price: 139, originalPrice: 199 },
  { id: "pcb", label: "PCB Combo", subjects: ["Physics", "Chemistry", "Biology"], price: 149, originalPrice: 209 },
  { id: "pcmb", label: "PCMB Combo", subjects: ["Physics", "Chemistry", "Mathematics", "Biology"], price: 179, originalPrice: 259 },
];

// Get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  const stored = localStorage.getItem("cart_items");
  return stored ? JSON.parse(stored) : [];
};

// Add item to cart
export const addToCart = (productId: string): void => {
  const items = getCartItems();
  if (!items.some(item => item.productId === productId)) {
    items.push({ productId, addedAt: new Date().toISOString() });
    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

// Add multiple items (for combo)
export const addMultipleToCart = (productIds: string[]): void => {
  const items = getCartItems();
  let added = false;
  
  productIds.forEach(productId => {
    if (!items.some(item => item.productId === productId)) {
      items.push({ productId, addedAt: new Date().toISOString() });
      added = true;
    }
  });
  
  if (added) {
    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

// Remove item from cart
export const removeFromCart = (productId: string): void => {
  const items = getCartItems().filter(item => item.productId !== productId);
  localStorage.setItem("cart_items", JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Clear cart
export const clearCart = (): void => {
  localStorage.setItem("cart_items", JSON.stringify([]));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Get cart count
export const getCartCount = (): number => {
  return getCartItems().length;
};

// Detect best combo for given subjects
export const detectBestCombo = (subjects: string[]): ComboConfig | null => {
  const uniqueSubjects = [...new Set(subjects.map(s => s.toLowerCase()))];
  
  // Sort combos by savings (most savings first)
  const sortedCombos = [...comboConfigs].sort((a, b) => 
    (b.originalPrice - b.price) - (a.originalPrice - a.price)
  );
  
  for (const combo of sortedCombos) {
    const comboSubjectsLower = combo.subjects.map(s => s.toLowerCase());
    const hasAllSubjects = comboSubjectsLower.every(sub => 
      uniqueSubjects.includes(sub)
    );
    
    if (hasAllSubjects) {
      return combo;
    }
  }
  
  return null;
};

// Calculate cart total with auto-applied discounts
export interface CartCalculation {
  items: { productId: string; subject: string; originalPrice: number; finalPrice: number; inCombo: boolean }[];
  appliedCombo: ComboConfig | null;
  subtotal: number;
  discount: number;
  total: number;
}

export const calculateCartTotal = (
  products: { id: string; subject: string; price: number }[]
): CartCalculation => {
  const subjects = products.map(p => p.subject);
  const bestCombo = detectBestCombo(subjects);
  
  if (bestCombo) {
    const comboSubjectsLower = bestCombo.subjects.map(s => s.toLowerCase());
    const comboProducts = products.filter(p => 
      comboSubjectsLower.includes(p.subject.toLowerCase())
    );
    const nonComboProducts = products.filter(p => 
      !comboSubjectsLower.includes(p.subject.toLowerCase())
    );
    
    const subtotal = products.reduce((sum, p) => sum + p.price, 0);
    const comboSubtotal = comboProducts.reduce((sum, p) => sum + p.price, 0);
    const nonComboTotal = nonComboProducts.reduce((sum, p) => sum + p.price, 0);
    
    // Replace combo products total with combo price
    const total = bestCombo.price + nonComboTotal;
    const discount = subtotal - total;
    
    const items = products.map(p => ({
      productId: p.id,
      subject: p.subject,
      originalPrice: p.price,
      finalPrice: comboSubjectsLower.includes(p.subject.toLowerCase()) 
        ? Math.round(bestCombo.price / comboProducts.length) 
        : p.price,
      inCombo: comboSubjectsLower.includes(p.subject.toLowerCase()),
    }));
    
    return { items, appliedCombo: bestCombo, subtotal, discount, total };
  }
  
  // No combo applicable
  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  const items = products.map(p => ({
    productId: p.id,
    subject: p.subject,
    originalPrice: p.price,
    finalPrice: p.price,
    inCombo: false,
  }));
  
  return { items, appliedCombo: null, subtotal, discount: 0, total: subtotal };
};

// Get subjects for a combo ID
export const getComboSubjects = (comboId: string): string[] => {
  const combo = comboConfigs.find(c => c.id === comboId);
  return combo?.subjects || [];
};
