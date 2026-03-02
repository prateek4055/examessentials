import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  getCartItems,
  removeFromCart as removeCartItem,
  clearCart,
  calculateCartTotal,
  CartCalculation,
  CartItem
} from "@/lib/cartUtils";

import { getProxiedImageUrl } from "@/lib/utils";

interface CartProduct {
  id: string;
  title: string;
  subject: string;
  class: string;
  price: number;
  images: string[] | null;
  category: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [calculation, setCalculation] = useState<CartCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartProducts();

    const handleCartUpdate = () => fetchCartProducts();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const fetchCartProducts = async () => {
    try {
      const items = getCartItems();
      setCartItems(items);

      if (items.length === 0) {
        setProducts([]);
        setCalculation(null);
        setIsLoading(false);
        return;
      }

      const productIds = items.map(item => item.productId);

      const { data, error } = await supabase
        .from("products")
        .select("id, title, subject, class, price, images, category")
        .in("id", productIds);

      if (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
        return;
      }

      const fetchedProducts = (data || []) as CartProduct[];
      setProducts(fetchedProducts);

      // Calculate totals with auto-discount (pass category for correct pricing)
      const calc = calculateCartTotal(
        fetchedProducts.map(p => ({ id: p.id, subject: p.subject, price: p.price, category: p.category }))
      );
      setCalculation(calc);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeCartItem(productId);
    toast.success("Removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (products.length === 0) return;

    // Navigate to purchase with cart data
    const productIds = products.map(p => p.id).join(",");
    const total = calculation?.total || 0;
    const comboIds = calculation?.appliedCombos?.map(c => c.id).join(",") || "";
    navigate(`/purchase/cart?products=${productIds}&total=${total}&combo=${comboIds}`);
  };

  const getProductImage = (product: CartProduct) => {
    return getProxiedImageUrl(product.images?.[0]) || null;
  };

  return (
    <>
      <SEOHead
        title="Your Cart"
        description="Review your cart and checkout with combo discounts applied automatically. Premium handwritten notes for Class 11 & 12."
        noIndex={true}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Your Cart
                  </h1>
                  <p className="text-muted-foreground">
                    {products.length} item{products.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {products.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-destructive">
                  Clear All
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded w-1/3" />
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-4 bg-muted rounded w-1/5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Add some study notes to get started!
                  </p>
                  <Button asChild>
                    <Link to="/products">Browse Notes</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Combo Discount Banners - one for each applied combo */}
                {calculation?.appliedCombos && calculation.appliedCombos.length > 0 && (
                  <div className="space-y-2">
                    {calculation.appliedCombos.map((combo) => {
                      const comboSavings = combo.originalPrice - combo.price;
                      return (
                        <Card key={combo.id} className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-accent/20 rounded-full">
                              <Sparkles className="w-5 h-5 text-accent" />
                            </div>
                            <div className="flex-1">
                              <p className="font-display font-semibold text-foreground">
                                {combo.label} Applied!
                              </p>
                              <p className="text-sm text-muted-foreground">
                                You're saving ₹{comboSavings} with this combo
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                              <Tag className="w-3 h-3 mr-1" />
                              ₹{comboSavings} OFF
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Cart Items */}
                {products.map((product) => {
                  const itemCalc = calculation?.items.find(i => i.productId === product.id);
                  const isInCombo = itemCalc?.inCombo || false;

                  return (
                    <Card key={product.id} className={`overflow-hidden ${isInCombo ? "border-accent/30" : ""}`}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                            {getProductImage(product) ? (
                              <img
                                src={getProductImage(product)!}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-display font-semibold text-foreground truncate">
                                  {product.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {product.subject} • Class {product.class}
                                </p>
                              </div>
                              {isInCombo && (
                                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 whitespace-nowrap">
                                  In Combo
                                </Badge>
                              )}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <div>
                                {isInCombo ? (
                                  <div className="flex items-center gap-2">
                                    <p className="font-display text-lg font-bold text-primary">
                                      Included
                                    </p>
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₹{product.price}
                                    </span>
                                  </div>
                                ) : (
                                  <p className="font-display text-lg font-bold text-primary">
                                    ₹{product.price}
                                  </p>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveItem(product.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Cart Summary */}
                <Card className="bg-secondary/50">
                  <CardContent className="p-6">
                    {calculation && (
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Subtotal ({products.length} items)</span>
                          <span>₹{calculation.subtotal}</span>
                        </div>

                        {calculation.appliedCombos && calculation.appliedCombos.length > 0 && calculation.appliedCombos.map((combo) => {
                          const comboSavings = combo.originalPrice - combo.price;
                          return (
                            <div key={combo.id} className="flex items-center justify-between text-accent">
                              <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {combo.label}
                              </span>
                              <span>-₹{comboSavings}</span>
                            </div>
                          );
                        })}

                        <div className="border-t border-border pt-3 flex items-center justify-between">
                          <span className="font-display font-semibold text-foreground">Total</span>
                          <span className="font-display text-2xl font-bold text-foreground">
                            ₹{calculation.total}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mb-4">
                      {calculation?.appliedCombos && calculation.appliedCombos.length > 0
                        ? `Great choice! You're getting the best deal with ${calculation.appliedCombos.map(c => c.label).join(" & ")}.`
                        : "Add more subjects to unlock combo discounts!"}
                    </p>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/products">Add More</Link>
                      </Button>
                      <Button variant="gradient" className="flex-1" onClick={handleCheckout}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Checkout ₹{calculation?.total || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cart;
