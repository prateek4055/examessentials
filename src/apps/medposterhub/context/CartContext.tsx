import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { Poster } from "../data/posters";

export interface CartItem extends Poster {
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Poster, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Poster, size: string, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity }];
    });
    toast.success("Added to cart");
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSize === size))
    );
    toast.info("Removed from cart");
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Rough estimation of price based on size logic from original code or hardcoded defaults if missing
  // The original poster interface had price: { small, medium, large }
  // We need to map size string to these keys.
  const getPriceForSize = (item: CartItem) => {
      if (item.selectedSize === "A3") return item.price.small;
      if (item.selectedSize === "A2") return item.price.medium;
      if (item.selectedSize === "A1") return item.price.large; 
      return item.price.medium; // default fallback
  };

  const totalPrice = cart.reduce((acc, item) => acc + (getPriceForSize(item) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
