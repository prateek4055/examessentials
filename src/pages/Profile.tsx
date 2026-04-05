import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, Calendar, Save, ShoppingBag, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().max(15).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Order {
  id: string;
  student_name: string;
  amount: number;
  payment_status: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    subject: string;
    class: string;
    images: string[] | null;
  } | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posterOrders, setPosterOrders] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<{
    full_name: string | null;
    email: string | null;
    phone: string | null;
    created_at: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Redirect if not logged in, or to admin panel if admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Fetch profile data and orders
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, created_at")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        const profileInfo = {
          full_name: profile?.full_name || user.user_metadata?.full_name || null,
          email: profile?.email || user.email || null,
          phone: null,
          created_at: profile?.created_at || user.created_at,
        };

        setProfileData(profileInfo);
        reset({ 
          full_name: profileInfo.full_name || "", 
          phone: profileInfo.phone || "" 
        });

        // Fetch regular orders by email
        if (user.email) {
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("id, student_name, amount, payment_status, created_at, phone, product_id")
            .eq("email", user.email)
            .order("created_at", { ascending: false });

          if (ordersError) {
            console.error("Error fetching orders:", ordersError);
          } else {
            // Fetch product details separately for each order
            const ordersWithProducts = await Promise.all(
              (ordersData || []).map(async (order) => {
                if (order.product_id) {
                  const { data: product } = await supabase
                    .from("products")
                    .select("id, title, subject, class, images")
                    .eq("id", order.product_id)
                    .single();
                  return { ...order, product: product || null };
                }
                return { ...order, product: null };
              })
            );
            setOrders(ordersWithProducts as any);
          }
        }

        // Fetch physical poster orders by user_id
        const { data: posterOrdersData, error: posterOrdersError } = await (supabase as any)
          .from("poster_orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (posterOrdersError) {
          console.error("Error fetching poster orders:", posterOrdersError);
        } else {
          setPosterOrders(posterOrdersData || []);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: data.full_name })
        .eq("id", user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setProfileData((prev) => prev ? { ...prev, full_name: data.full_name } : null);
        reset({ full_name: data.full_name, phone: data.phone });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
      case "printing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Exam Essentials</title>
        <meta name="description" content="View and update your Exam Essentials account profile." />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">
              My Profile
            </h1>

            <div className="grid gap-6">
              {/* Personal Information Card */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Personal Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                    <div className="p-3 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium text-foreground">
                        {profileData?.full_name || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {profileData?.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">
                        {profileData?.phone || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium text-foreground">
                        {profileData?.created_at
                          ? formatDate(profileData.created_at)
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Name Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="font-body">
                      Update Name
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        {...register("full_name")}
                        className="bg-secondary border-border flex-1"
                      />
                      <Button
                        type="submit"
                        variant="gradient"
                        disabled={isSubmitting || !isDirty}
                      >
                        {isSubmitting ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
                      </Button>
                    </div>
                    {errors.full_name && (
                      <p className="text-sm text-destructive font-body">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* MedPosterHub Physical Orders Card */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Physical Poster Orders
                  </h2>
                </div>

                {posterOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm mb-4">No posters ordered yet.</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/medposterhub">Shop Posters</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {posterOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-xl bg-secondary border border-border/50 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                              Order ID: {order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.delivery_status || 'pending')}`}>
                                {order.delivery_status || 'pending'}
                             </span>
                             {order.payment_plan === "partial" && (
                                <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-tighter">
                                  Trust Plan (50/50)
                                </p>
                             )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-12 h-16 rounded bg-background border border-border overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.selectedSize} × {item.quantity}
                                  {item.isDoubleSided && <span className="ml-1 text-green-600 font-medium">Double Sided</span>}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border/30 flex flex-wrap justify-between items-end gap-4">
                           <div className="space-y-1">
                              {order.tracking_id && (
                                <div className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-100">
                                  <strong className="block text-[9px] uppercase opacity-70">Tracking Info</strong>
                                  {order.courier_name}: {order.tracking_id}
                                </div>
                              )}
                              {order.payment_plan === "partial" && order.balance_due > 0 && (
                                <div className="text-[11px] bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-100">
                                  <strong className="block text-[9px] uppercase opacity-70">Payment Status</strong>
                                  ₹{order.balance_due} payable after dispatch
                                </div>
                              )}
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-muted-foreground">Total Bill</p>
                              <p className="text-lg font-bold text-foreground">₹{order.total_amount}</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
