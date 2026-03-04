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
  category?: string; // Optional category filter (e.g., "mindmaps", "formula-sheet")
}

// Mind Maps combo pricing
export const mindMapsComboConfigs: ComboConfig[] = [
  { id: "phy-chem-mindmaps", label: "Physics + Chemistry Mind Maps", subjects: ["Physics", "Chemistry"], price: 249, originalPrice: 298, category: "mindmaps" },
  { id: "pcb-mindmaps", label: "PCB Mind Maps Combo", subjects: ["Physics", "Chemistry", "Biology"], price: 299, originalPrice: 447, category: "mindmaps" },
];

// Formula Sheets / Handwritten Notes combo pricing (original pricing)
export const formulaSheetComboConfigs: ComboConfig[] = [
  { id: "phy-chem", label: "Physics + Chemistry", subjects: ["Physics", "Chemistry"], price: 99, originalPrice: 149, category: "formula-sheet" },
  { id: "pcm", label: "PCM Combo", subjects: ["Physics", "Chemistry", "Maths"], price: 139, originalPrice: 199, category: "formula-sheet" },
  { id: "pcb", label: "PCB Combo", subjects: ["Physics", "Chemistry", "Biology"], price: 149, originalPrice: 209, category: "formula-sheet" },
  { id: "pcmb", label: "PCMB Combo", subjects: ["Physics", "Chemistry", "Maths", "Biology"], price: 179, originalPrice: 259, category: "formula-sheet" },
];

// Legacy: All combos for backward compatibility (uses formula sheet pricing by default)
export const comboConfigs: ComboConfig[] = formulaSheetComboConfigs;

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

// Detect best combo for given subjects and category
export const detectBestCombo = (subjects: string[], category?: string): ComboConfig | null => {
  const uniqueSubjects = [...new Set(subjects.map(s => s.toLowerCase()))];

  // Choose the right combo configs based on category
  let applicableCombos: ComboConfig[];
  if (category === "mindmaps") {
    applicableCombos = mindMapsComboConfigs;
  } else {
    applicableCombos = formulaSheetComboConfigs;
  }

  // Sort combos by savings (most savings first)
  const sortedCombos = [...applicableCombos].sort((a, b) =>
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
  items: { productId: string; subject: string; originalPrice: number; finalPrice: number; inCombo: boolean; comboCategory?: string }[];
  appliedCombos: ComboConfig[]; // Multiple combos can be applied
  subtotal: number;
  discount: number;
  total: number;
}

export interface ProductForCalculation {
  id: string;
  subject: string;
  price: number;
  category?: string;
}

// Calculate combo for a single category
const calculateCategoryCombo = (
  products: ProductForCalculation[],
  category: string
): { items: CartCalculation['items']; combo: ComboConfig | null; comboTotal: number; originalTotal: number } => {
  const subjects = products.map(p => p.subject);
  const bestCombo = detectBestCombo(subjects, category);

  if (bestCombo) {
    const comboSubjectsLower = bestCombo.subjects.map(s => s.toLowerCase());
    const comboProducts = products.filter(p =>
      comboSubjectsLower.includes(p.subject.toLowerCase())
    );
    const nonComboProducts = products.filter(p =>
      !comboSubjectsLower.includes(p.subject.toLowerCase())
    );

    const originalTotal = products.reduce((sum, p) => sum + p.price, 0);
    const nonComboTotal = nonComboProducts.reduce((sum, p) => sum + p.price, 0);
    const comboTotal = bestCombo.price + nonComboTotal;

    const items = products.map(p => ({
      productId: p.id,
      subject: p.subject,
      originalPrice: p.price,
      finalPrice: comboSubjectsLower.includes(p.subject.toLowerCase())
        ? Math.round(bestCombo.price / comboProducts.length)
        : p.price,
      inCombo: comboSubjectsLower.includes(p.subject.toLowerCase()),
      comboCategory: comboSubjectsLower.includes(p.subject.toLowerCase()) ? category : undefined,
    }));

    return { items, combo: bestCombo, comboTotal, originalTotal };
  }

  // No combo applicable for this category
  const originalTotal = products.reduce((sum, p) => sum + p.price, 0);
  const items = products.map(p => ({
    productId: p.id,
    subject: p.subject,
    originalPrice: p.price,
    finalPrice: p.price,
    inCombo: false,
    comboCategory: undefined,
  }));

  return { items, combo: null, comboTotal: originalTotal, originalTotal };
};

export const calculateCartTotal = (
  products: ProductForCalculation[],
  promoCode?: string
): CartCalculation => {
  // Group products by category
  const mindmapProducts = products.filter(p => p.category === "mindmaps");
  const formulaSheetProducts = products.filter(p => p.category === "formula-sheet");
  const otherProducts = products.filter(p => p.category !== "mindmaps" && p.category !== "formula-sheet");

  // Calculate combos for each category separately
  const mindmapResult = mindmapProducts.length > 0
    ? calculateCategoryCombo(mindmapProducts, "mindmaps")
    : { items: [], combo: null, comboTotal: 0, originalTotal: 0 };

  const formulaResult = formulaSheetProducts.length > 0
    ? calculateCategoryCombo(formulaSheetProducts, "formula-sheet")
    : { items: [], combo: null, comboTotal: 0, originalTotal: 0 };

  // Other products have no combos
  const otherItems = otherProducts.map(p => ({
    productId: p.id,
    subject: p.subject,
    originalPrice: p.price,
    finalPrice: p.price,
    inCombo: false,
    comboCategory: undefined,
  }));
  const otherTotal = otherProducts.reduce((sum, p) => sum + p.price, 0);

  // Combine all results
  const allItems = [...mindmapResult.items, ...formulaResult.items, ...otherItems];
  const appliedCombos: ComboConfig[] = [];
  if (mindmapResult.combo) appliedCombos.push(mindmapResult.combo);
  if (formulaResult.combo) appliedCombos.push(formulaResult.combo);

  let subtotal = mindmapResult.originalTotal + formulaResult.originalTotal + otherTotal;
  let total = mindmapResult.comboTotal + formulaResult.comboTotal + otherTotal;
  let discount = subtotal - total;

  // Apply Promo Code discount AFTER combo discount
  const isPromoValid = promoCode?.trim().toUpperCase() === "WELCOME30";

  if (isPromoValid) {
    const promoDiscount = Math.round(total * 0.30);
    const priceAfterPromo = total - promoDiscount;

    // Add promo as an additional stacked discount
    appliedCombos.push({
      id: "promo-welcome30",
      label: "WELCOME30 Promo (30% OFF)",
      subjects: [],
      price: priceAfterPromo,
      originalPrice: total,
    });

    discount += promoDiscount;
    total = priceAfterPromo;

    // Update individual item final prices proportionally
    allItems.forEach(item => {
      item.finalPrice = Math.round(item.finalPrice * 0.70);
    });
  }

  return {
    items: allItems,
    appliedCombos,
    subtotal,
    discount,
    total
  };
};

// Get subjects for a combo ID
export const getComboSubjects = (comboId: string): string[] => {
  const allCombos = [...mindMapsComboConfigs, ...formulaSheetComboConfigs];
  const combo = allCombos.find(c => c.id === comboId);
  return combo?.subjects || [];
};
