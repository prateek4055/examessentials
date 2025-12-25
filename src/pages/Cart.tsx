import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface PendingOrder {
  id: string;
  product_id: string | null;
  student_name: string;
  email: string;
  phone: string;
  class: string;
  amount: number;
  payment_status: string;
  created_at: string;
  product?: {
    title: string;
    subject: string;
    images: string[];
  };
}

const Cart = () => {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
  }, [user]);

  const fetchPendingOrders = async () => {
    try {
      // Get pending orders from localStorage (for guest users)
      const storedOrders = localStorage.getItem("pending_orders");
      let localOrderIds: string[] = [];
      
      if (storedOrders) {
        localOrderIds = JSON.parse(storedOrders);
      }

      if (localOrderIds.length === 0) {
        setPendingOrders([]);
        setIsLoading(false);
        return;
      }

      // Fetch orders with their product details
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .in("id", localOrderIds)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
        return;
      }

      // Fetch product details for each order
      const ordersWithProducts = await Promise.all(
        (orders || []).map(async (order) => {
          if (order.product_id) {
            const { data: product } = await supabase
              .from("products")
              .select("title, subject, images")
              .eq("id", order.product_id)
              .single();
            
            return { ...order, product } as PendingOrder;
          }
          return order as PendingOrder;
        })
      );

      setPendingOrders(ordersWithProducts);
      
      // Clean up localStorage - remove orders that are no longer pending
      const stillPendingIds = ordersWithProducts.map(o => o.id);
      localStorage.setItem("pending_orders", JSON.stringify(stillPendingIds));
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (orderId: string) => {
    const storedOrders = localStorage.getItem("pending_orders");
    if (storedOrders) {
      const orderIds = JSON.parse(storedOrders).filter((id: string) => id !== orderId);
      localStorage.setItem("pending_orders", JSON.stringify(orderIds));
    }
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    toast.success("Removed from cart");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalAmount = pendingOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <>
      <Helmet>
        <title>Your Cart - Exam Essentials</title>
        <meta name="description" content="Complete your pending orders for study notes" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
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
                  {pendingOrders.length} pending order{pendingOrders.length !== 1 ? "s" : ""}
                </p>
              </div>
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
            ) : pendingOrders.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    No pending orders found. Start shopping for study notes!
                  </p>
                  <Button asChild>
                    <Link to="/products">Browse Notes</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          {order.product?.images?.[0] ? (
                            <img
                              src={order.product.images[0]}
                              alt={order.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display font-semibold text-foreground truncate">
                                {order.product?.title || "Product"}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {order.product?.subject || "Notes"} • Class {order.class}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                              Pending
                            </Badge>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              <p className="font-display text-lg font-bold text-primary">
                                ₹{order.amount}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Added {formatDate(order.created_at)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => removeFromCart(order.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/purchase/${order.product_id}`)}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Cart Summary */}
                <Card className="bg-secondary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">Total ({pendingOrders.length} items)</span>
                      <span className="font-display text-2xl font-bold text-foreground">
                        ₹{totalAmount}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete your payment to access your study materials instantly.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/products">Continue Shopping</Link>
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
