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
  class?: string;
}

// Calculate combo for a single category
const calculateCategoryCombo = (
  products: ProductForCalculation[],
  category: string
): { items: CartCalculation['items']; combos: ComboConfig[]; comboTotal: number; originalTotal: number } => {
  const originalTotal = products.reduce((sum, p) => sum + p.price, 0);

  // Clone products list to keep track of remaining items
  let remaining = [...products];
  const combos: ComboConfig[] = [];
  const finalItems: CartCalculation['items'] = [];

  while (true) {
    const subjects = remaining.map(p => p.subject);
    const bestCombo = detectBestCombo(subjects, category);
    if (!bestCombo) break;

    // We found a combo. We need to consume exactly one product for each subject in bestCombo
    const comboSubjectsLower = bestCombo.subjects.map(s => s.toLowerCase());
    const matchedProducts: ProductForCalculation[] = [];

    // For each subject in the combo, pick the first product that matches
    for (const sub of comboSubjectsLower) {
      const idx = remaining.findIndex(p => p.subject.toLowerCase() === sub);
      if (idx !== -1) {
        matchedProducts.push(remaining[idx]);
        remaining.splice(idx, 1);
      }
    }

    // Add the combo to our list
    combos.push(bestCombo);

    // Add matched products to final items
    matchedProducts.forEach(p => {
      finalItems.push({
        productId: p.id,
        subject: p.subject,
        originalPrice: p.price,
        finalPrice: Math.round(bestCombo.price / matchedProducts.length),
        inCombo: true,
        comboCategory: category,
      });
    });
  }

  // Any remaining products are not in any combo
  remaining.forEach(p => {
    finalItems.push({
      productId: p.id,
      subject: p.subject,
      originalPrice: p.price,
      finalPrice: p.price,
      inCombo: false,
      comboCategory: undefined,
    });
  });

  const comboTotal = combos.reduce((sum, c) => sum + c.price, 0) + remaining.reduce((sum, p) => sum + p.price, 0);

  return {
    items: finalItems,
    combos,
    comboTotal,
    originalTotal
  };
};

export const calculateCartTotal = (
  products: ProductForCalculation[],
  promoCode?: string
): CartCalculation => {
  // Group products by class first
  const productsByClass: { [key: string]: ProductForCalculation[] } = {};
  products.forEach(p => {
    const cls = p.class || "default";
    if (!productsByClass[cls]) {
      productsByClass[cls] = [];
    }
    productsByClass[cls].push(p);
  });

  const allItems: CartCalculation['items'] = [];
  const appliedCombos: ComboConfig[] = [];
  let subtotal = 0;
  let total = 0;

  Object.entries(productsByClass).forEach(([classLevel, classProducts]) => {
    const mindmapProducts = classProducts.filter(p => p.category === "mindmaps");
    const formulaSheetProducts = classProducts.filter(p => p.category === "formula-sheet" || !p.category);
    const otherProducts = classProducts.filter(p => p.category !== "mindmaps" && p.category !== "formula-sheet" && p.category);

    const mindmapResult = mindmapProducts.length > 0
      ? calculateCategoryCombo(mindmapProducts, "mindmaps")
      : { items: [], combos: [], comboTotal: 0, originalTotal: 0 };

    const formulaResult = formulaSheetProducts.length > 0
      ? calculateCategoryCombo(formulaSheetProducts, "formula-sheet")
      : { items: [], combos: [], comboTotal: 0, originalTotal: 0 };

    const otherItems = otherProducts.map(p => ({
      productId: p.id,
      subject: p.subject,
      originalPrice: p.price,
      finalPrice: p.price,
      inCombo: false,
      comboCategory: undefined,
    }));
    const otherTotal = otherProducts.reduce((sum, p) => sum + p.price, 0);
    const otherOriginalTotal = otherProducts.reduce((sum, p) => sum + p.price, 0);

    // Dynamic labelling of combos to include class if available
    const processedCombos = [...mindmapResult.combos, ...formulaResult.combos].map(combo => {
      const displayClass = classLevel !== "default" ? ` (Class ${classLevel})` : "";
      return {
        ...combo,
        id: `${combo.id}-${classLevel}`,
        label: `${combo.label}${displayClass}`,
      };
    });

    allItems.push(...mindmapResult.items, ...formulaResult.items, ...otherItems);
    appliedCombos.push(...processedCombos);
    subtotal += mindmapResult.originalTotal + formulaResult.originalTotal + otherOriginalTotal;
    total += mindmapResult.comboTotal + formulaResult.comboTotal + otherTotal;
  });

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
