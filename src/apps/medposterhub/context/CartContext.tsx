import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { Poster, PosterMaterial, calculateVariantPrice } from "../data/posters";

export interface CartItem extends Poster {
  selectedSize: string;
  selectedMaterial?: PosterMaterial;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Poster,
    size: string,
    quantity: number,
    material?: PosterMaterial
  ) => void;
  removeFromCart: (productId: string, size: string, material?: PosterMaterial) => void;
  updateQuantity: (productId: string, size: string, quantity: number, material?: PosterMaterial) => void;
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

  const addToCart = (
    product: Poster,
    size: string,
    quantity: number,
    material: PosterMaterial = "matte"
  ) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          (item.selectedMaterial || "matte") === material
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          (item.selectedMaterial || "matte") === material
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          selectedMaterial: material,
          quantity,
        },
      ];
    });
    toast.success(`Added ${product.title} to cart`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, material: PosterMaterial = "matte") => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === size &&
            (item.selectedMaterial || "matte") === material
          )
      )
    );
    toast.info("Removed from cart");
  };

  const updateQuantity = (
    productId: string,
    size: string,
    quantity: number,
    material: PosterMaterial = "matte"
  ) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedSize === size &&
        (item.selectedMaterial || "matte") === material
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getPriceForSize = (item: CartItem) => {
    const material = item.selectedMaterial || "matte";
    return calculateVariantPrice(item.price, material, item.selectedSize);
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
