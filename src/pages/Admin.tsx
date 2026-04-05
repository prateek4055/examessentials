import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Package,
  ShoppingCart,
  LayoutDashboard,
  FileText,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAllProducts,
  fetchAllOrders,
  deleteProduct,
  updateProduct,
  updateOrderStatus,
  Product,
  Order,
} from "@/lib/api";
import { calculateCartTotal } from "@/lib/cartUtils";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpeg";
import { medicalApps } from "@/apps/medical/data/medicalAppsData";


type Tab = "products" | "orders" | "poster-orders" | "blogs" | "wiki" | "sendmail";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posterOrders, setPosterOrders] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Send Mail state
  const [mailForm, setMailForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    class: "12",
    productIds: [] as string[],
  });
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isFreeDelivery, setIsFreeDelivery] = useState(true);
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    // Wait for auth loading to complete before checking permissions
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  // Only load data after confirmed admin status
  useEffect(() => {
    if (isAdmin && !authLoading) {
      loadData();
    }
  }, [isAdmin, authLoading]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, ordersData, posterOrdersData, blogsData, articlesData] = await Promise.all([
        fetchAllProducts(),
        fetchAllOrders(),
        (supabase as any).from("poster_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("articles").select("*").order("created_at", { ascending: false }),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setPosterOrders(posterOrdersData.data || []);
      setBlogs(blogsData.data || []);
      setArticles(articlesData.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await supabase.from("blog_posts").delete().eq("id", id);
      setBlogs(blogs.filter((b) => b.id !== id));
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBlogPublished = async (blog: any) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({ published: !blog.published })
        .eq("id", blog.id)
        .select()
        .single();

      if (error) throw error;
      setBlogs(blogs.map((b) => (b.id === blog.id ? data : b)));
      toast({
        title: "Success",
        description: `Blog post ${data.published ? "published" : "unpublished"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (product: Product) => {
    try {
      const updated = await updateProduct(product.id, {
        published: !product.published,
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
      toast({
        title: "Success",
        description: `Product ${updated.published ? "published" : "unpublished"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (
    order: Order,
    status: "pending" | "completed" | "failed"
  ) => {
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders(orders.map((o) => (o.id === order.id ? updated : o)));
      toast({
        title: "Success",
        description: "Order status updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Delete order handler
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) {
        toast({ title: "Error", description: `Failed: ${error.message}`, variant: "destructive" });
        return;
      }

      setOrders(orders.filter((o) => o.id !== id));
      toast({ title: "Success", description: "Order deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to delete order.", variant: "destructive" });
    }
  };

  // Send Mail handler
  const handleSendMail = async () => {
    if (!mailForm.studentName || !mailForm.email || !mailForm.phone || mailForm.productIds.length === 0) {
      toast({ title: "Error", description: "Please fill all fields and select at least one product.", variant: "destructive" });
      return;
    }
    setIsSendingMail(true);
    try {
      const selectedProducts = products.filter((p) => mailForm.productIds.includes(p.id));
      const productIdStr = mailForm.productIds.join(",");
      const productNames = selectedProducts.map((p) => p.title).join(", ");

      let orderAmount: number;
      let paymentId: string;

      if (isFreeDelivery) {
        orderAmount = 0;
        paymentId = "admin_free_" + crypto.randomUUID();
      } else {
        // Use combo total if combos detected, otherwise sum custom prices
        if (detectedCombos.length > 0) {
          orderAmount = cartCalc.total;
          // Use combo-calculated per-item prices
          const customPricesPayload: Record<string, number> = {};
          cartCalc.items.forEach((item) => {
            customPricesPayload[item.productId] = item.finalPrice;
          });
          paymentId = "admin_custom_" + JSON.stringify(customPricesPayload);
        } else {
          orderAmount = mailForm.productIds.reduce((sum, id) => {
            const price = parseFloat(customPrices[id] || "0");
            return sum + (isNaN(price) ? 0 : price);
          }, 0);
          const customPricesPayload: Record<string, number> = {};
          mailForm.productIds.forEach((id) => {
            customPricesPayload[id] = parseFloat(customPrices[id] || "0") || 0;
          });
          paymentId = "admin_custom_" + JSON.stringify(customPricesPayload);
        }
      }

      // Step 1: Create admin order via RPC (bypasses PostgREST schema cache)
      const { data: orderId, error: orderError } = await supabase.rpc("create_admin_order" as any, {
        p_product_id: productIdStr,
        p_student_name: mailForm.studentName.trim(),
        p_email: mailForm.email.trim().toLowerCase(),
        p_phone: mailForm.phone.trim(),
        p_class: mailForm.class,
        p_amount: orderAmount,
        p_payment_status: "completed",
        p_razorpay_payment_id: "admin_manual_" + paymentId, // Trigger will ignore this prefix
        p_razorpay_order_id: "admin_order_" + crypto.randomUUID(),
      });

      if (orderError) {
        toast({ title: "Step 1 Failed: Order Creation", description: orderError.message, variant: "destructive" });
        return;
      }

      // Step 2: Direct Synchronous Delivery via Worker
      // Calling the worker directly from the UI allows us to show a real loading spinner
      // for the 10-20 seconds it takes to process the PDFs.
      const workerPayload = {
        products: selectedProducts.map((p) => {
          const itemPrice = isFreeDelivery ? 0 : (
            detectedCombos.length > 0 
              ? (cartCalc.items.find(i => i.productId === p.id)?.finalPrice || p.price)
              : (parseFloat(customPrices[p.id]) || p.price)
          );
          
          return {
            id: p.id,
            title: p.title,
            price: itemPrice,
            image_url: p.images && p.images[0] 
              ? `https://jfqjeqgwbpnnzdgcpbzw.supabase.co/storage/v1/object/public/product-images/${p.images[0]}`
              : '',
            pdf_url: `https://jfqjeqgwbpnnzdgcpbzw.supabase.co/storage/v1/object/public/original_pdfs/${p.pdf_url}`
          };
        }),
        student_name: mailForm.studentName.trim(),
        phone: mailForm.phone.trim(),
        email: mailForm.email.trim().toLowerCase(),
        order_id: orderId,
        total_amount: orderAmount,
        payment_id: "admin_manual_" + paymentId
      };

      const workerResponse = await fetch("https://pdf-workerdf-workerpdf.onrender.com/process-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-worker-secret": "ExamNotes@2026"
        },
        body: JSON.stringify(workerPayload)
      });

      if (!workerResponse.ok) {
        const errorText = await workerResponse.text();
        throw new Error(`Worker Error: ${errorText}`);
      }

      toast({
        title: "Email Sent Successfully! ✉️",
        description: `Download link sent to ${mailForm.email} for ${productNames}.`,
      });

      // Clear form & refresh orders
      setMailForm({ studentName: "", email: "", phone: "", class: "12", productIds: [] });
      setIsFreeDelivery(true);
      setCustomPrices({});
      loadData();

    } catch (error: any) {
      console.error("Send mail error:", error);
      toast({ title: "Error", description: error?.message || "Unknown error occurred.", variant: "destructive" });
    } finally {
      setIsSendingMail(false);
    }
  };

  const productsWithPdf = products.filter((p) => p.pdf_url && p.pdf_url.length > 0);

  const toggleProductSelection = (productId: string) => {
    setMailForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  // Calculate combo pricing for selected products
  const selectedProductsForCalc = products
    .filter((p) => mailForm.productIds.includes(p.id))
    .map((p) => ({ id: p.id, subject: p.subject, price: p.price, category: p.category }));
  const cartCalc = calculateCartTotal(selectedProductsForCalc);
  const detectedCombos = cartCalc.appliedCombos;

  // Auto-detect and set combo prices when selection changes
  useEffect(() => {
    if (isAdmin && !authLoading && !isFreeDelivery && mailForm.productIds.length > 0) {
      const selected = products.filter((p) => mailForm.productIds.includes(p.id));
      const calc = calculateCartTotal(
        selected.map((p) => ({
          id: p.id,
          subject: p.subject,
          price: p.price,
          category: p.category,
        }))
      );

      const newCustomPrices = { ...customPrices };
      let hasChanged = false;
      calc.items.forEach((item) => {
        if (newCustomPrices[item.productId] !== String(item.finalPrice)) {
          newCustomPrices[item.productId] = String(item.finalPrice);
          hasChanged = true;
        }
      });

      if (hasChanged) {
        setCustomPrices(newCustomPrices);
      }
    }
  }, [mailForm.productIds, isFreeDelivery, products, isAdmin, authLoading]);

  // Show loading state until auth completes and we confirm admin status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground font-body">Loading...</div>
      </div>
    );
  }

  // Show loading while data is being fetched (only for admins)
  if (isAdmin && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground font-body">Loading...</div>
      </div>
    );
  }

  // Don't render admin UI if not admin (redirect will happen via useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Exam Essentials</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Exam Essentials"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div>
                  <span className="font-display text-lg font-semibold text-foreground">
                    Exam Essentials
                  </span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gold text-primary-foreground rounded-full">
                    Admin
                  </span>
                </div>
              </Link>

              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gradient-purple to-gradient-blue">
                  <Package className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">
                    Total Products
                  </p>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {products.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gradient-pink to-gradient-orange">
                  <ShoppingCart className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">
                    Total Orders
                  </p>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {orders.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gold">
                  <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-body">
                    Revenue
                  </p>
                  <p className="text-2xl font-display font-bold text-foreground">
                    ₹
                    {orders
                      .filter((o) => o.payment_status === "completed")
                      .reduce((sum, o) => sum + o.amount, 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={activeTab === "products" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("products")}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === "orders" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </Button>
            <Button
              variant={activeTab === "poster-orders" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("poster-orders")}
            >
              <Package className="w-4 h-4 mr-2" />
              Poster Orders
            </Button>
            <Button
              variant={activeTab === "blogs" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("blogs")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Blogs
            </Button>
            <Button
              variant={activeTab === "wiki" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("wiki")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Wiki
            </Button>
            <Button
              variant={activeTab === "sendmail" ? "gradient" : "secondary"}
              onClick={() => setActiveTab("sendmail")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Mail
            </Button>
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Products
                </h2>
                <Button asChild variant="gradient">
                  <Link to="/admin/product/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-secondary/50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-body font-medium text-foreground">
                                {product.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {product.subject}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs bg-secondary rounded-full">
                              Class {product.class}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-body text-foreground">
                            ₹{product.price}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${product.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                              {product.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleTogglePublished(product)}
                                title={
                                  product.published ? "Unpublish" : "Publish"
                                }
                              >
                                {product.published ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <Link to={`/admin/product/${product.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No products yet. Add your first product!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                Orders
              </h2>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-body font-medium text-foreground">
                                {order.student_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Class {order.class}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm text-foreground font-body">
                                {order.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-body text-foreground">
                            ₹{order.amount}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${order.payment_status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : order.payment_status === "failed"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground font-body">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {order.payment_status !== "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateOrderStatus(order, "completed")
                                  }
                                >
                                  Mark Completed
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Poster Orders Tab */}
          {activeTab === "poster-orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                Poster Orders (Physical)
              </h2>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {posterOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-secondary/50">
                          <td className="px-4 py-4">
                            <div className="font-body font-medium text-foreground">{order.customer_name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                            <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                            {order.address_line1}, {order.address_line2 && `${order.address_line2}, `} 
                            {order.city}, {order.state} - {order.pincode}
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-xs space-y-1">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="text-foreground">
                                  {item.quantity}x {item.title} ({item.selectedSize})
                                  {item.isDoubleSided && <span className="ml-1 text-green-500 font-bold">[DS]</span>}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-body text-foreground">₹{order.total_amount}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="text-[10px] flex items-center justify-between">
                                <span className="text-muted-foreground">Paid:</span>
                                <span className="font-bold text-green-600">₹{order.amount_paid}</span>
                              </div>
                              <div className="text-[10px] flex items-center justify-between">
                                <span className="text-muted-foreground">Due:</span>
                                <span className={`font-bold ${order.balance_due > 0 ? "text-amber-600" : "text-slate-400"}`}>₹{order.balance_due}</span>
                              </div>
                              {order.payment_plan === "partial" && order.balance_due > 0 && (
                                <button 
                                  onClick={async () => {
                                    await (supabase as any).from("poster_orders").update({ 
                                      balance_due: 0, 
                                      amount_paid: order.total_amount,
                                      payment_status: 'completed' 
                                    }).eq("id", order.id);
                                    loadData();
                                    toast({ title: "Balance Marked as Paid" });
                                  }}
                                  className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 rounded px-1 py-0.5 hover:bg-blue-600 hover:text-white transition-colors mt-1"
                                >
                                  Mark Final Paid
                                </button>
                              )}
                              {order.payment_plan === "partial" && (
                                <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 rounded px-1 py-0.5 text-center mt-1 font-bold">Trust Plan</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={order.delivery_status} 
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                await (supabase as any).from("poster_orders").update({ delivery_status: newStatus }).eq("id", order.id);
                                loadData();
                              }}
                              className="bg-secondary text-xs rounded border border-border px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <input 
                                type="text" 
                                placeholder="Tracking ID"
                                defaultValue={order.tracking_id}
                                onBlur={async (e) => {
                                  if (e.target.value !== order.tracking_id) {
                                     await (supabase as any).from("poster_orders").update({ tracking_id: e.target.value }).eq("id", order.id);
                                     toast({ title: "Tracking ID Updated" });
                                  }
                                }}
                                className="text-[10px] bg-secondary border border-border rounded px-1 w-24"
                              />
                              <input 
                                type="text" 
                                placeholder="Courier Name"
                                defaultValue={order.courier_name}
                                onBlur={async (e) => {
                                  if (e.target.value !== order.courier_name) {
                                     await (supabase as any).from("poster_orders").update({ courier_name: e.target.value }).eq("id", order.id);
                                     toast({ title: "Courier Updated" });
                                  }
                                }}
                                className="text-[10px] bg-secondary border border-border rounded px-1 w-24"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {posterOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                            No physical poster orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blogs Tab */}
          {activeTab === "blogs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Blog Posts
                </h2>
                <Button asChild variant="gradient">
                  <Link to="/admin/blog/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Blog Post
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-secondary/50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-body font-medium text-foreground">
                                {blog.title}
                              </p>
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {blog.excerpt}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs bg-secondary rounded-full">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${blog.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                              {blog.published ? "Published" : "Draft"}
                            </span>
                            {blog.featured && (
                              <span className="ml-2 px-2 py-1 text-xs bg-accent/20 text-accent rounded-full">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground font-body">
                            {new Date(blog.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleBlogPublished(blog)}
                                title={
                                  blog.published ? "Unpublish" : "Publish"
                                }
                              >
                                {blog.published ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <Link to={`/admin/blog/${blog.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {blogs.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No blog posts yet. Add your first blog post!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Send Mail Tab */}
          {activeTab === "sendmail" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-lg mx-auto space-y-6"
            >
              <h2 className="font-display text-xl font-bold text-foreground">
                Send Download Email
              </h2>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={mailForm.studentName}
                    onChange={(e) => setMailForm({ ...mailForm, studentName: e.target.value })}
                    placeholder="Enter student name"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    value={mailForm.email}
                    onChange={(e) => setMailForm({ ...mailForm, email: e.target.value })}
                    placeholder="student@email.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-1">Phone Number * <span className="text-xs text-purple-400">(= PDF Password)</span></label>
                  <input
                    type="tel"
                    value={mailForm.phone}
                    onChange={(e) => setMailForm({ ...mailForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-1">Class</label>
                  <select
                    value={mailForm.class}
                    onChange={(e) => setMailForm({ ...mailForm, class: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground font-body focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-1">
                    Products *{" "}
                    {mailForm.productIds.length > 0 && (
                      <span className="text-xs">
                        ({mailForm.productIds.length} selected)
                      </span>
                    )}
                  </label>
                  <div className="max-h-48 overflow-y-auto rounded-lg bg-secondary border border-border p-2 space-y-1">
                    {productsWithPdf.map((p) => (
                      <label key={p.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-purple-500/10 transition ${mailForm.productIds.includes(p.id) ? "bg-purple-500/20 border border-purple-500/40" : ""}`}>
                        <input
                          type="checkbox"
                          checked={mailForm.productIds.includes(p.id)}
                          onChange={() => toggleProductSelection(p.id)}
                          className="accent-purple-500"
                        />
                        <span className="text-sm text-foreground font-body flex-1">{p.title}</span>
                        <span className="text-xs text-muted-foreground">Class {p.class}</span>
                        {isFreeDelivery ? (
                          <span className="text-xs text-muted-foreground">₹{p.price}</span>
                        ) : (
                          mailForm.productIds.includes(p.id) && (
                            <input
                              type="number"
                              min="0"
                              value={customPrices[p.id] ?? String(p.price)}
                              onChange={(e) => {
                                setCustomPrices((prev) => ({ ...prev, [p.id]: e.target.value }));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-2 py-1 text-xs rounded bg-background border border-border text-foreground text-right"
                              placeholder="Price"
                            />
                          )
                        )}
                      </label>
                    ))}
                  </div>
                  {productsWithPdf.length === 0 && (
                    <p className="text-xs text-yellow-400 mt-1">No products with PDF files found. Upload PDFs first.</p>
                  )}
                </div>

                {/* Free Delivery Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                  <label className="text-sm font-body text-foreground cursor-pointer">
                    Free Replacement (No Invoice)
                  </label>
                  <input
                    type="checkbox"
                    checked={isFreeDelivery}
                    onChange={(e) => {
                      setIsFreeDelivery(e.target.checked);
                      if (!e.target.checked) {
                        // Initialize custom prices from product defaults
                        const defaults: Record<string, string> = {};
                        mailForm.productIds.forEach((id) => {
                          const prod = products.find((p) => p.id === id);
                          if (prod) defaults[id] = String(prod.price);
                        });
                        setCustomPrices(defaults);
                      }
                    }}
                    className="accent-purple-500 w-5 h-5"
                  />
                </div>

                {/* Detected Combos */}
                {detectedCombos.length > 0 && mailForm.productIds.length > 1 && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-sm font-semibold text-emerald-500 mb-1">🎉 Combo Detected!</p>
                    {detectedCombos.map((combo) => (
                      <div key={combo.id} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{combo.label}</span>
                        <span>
                          <span className="line-through mr-1">₹{combo.originalPrice}</span>
                          <span className="text-emerald-500 font-bold">₹{combo.price}</span>
                        </span>
                      </div>
                    ))}
                    {!isFreeDelivery && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Combo total: <span className="font-bold text-foreground">₹{cartCalc.total}</span>
                        {cartCalc.discount > 0 && <span className="text-emerald-500 ml-1">(Save ₹{cartCalc.discount})</span>}
                      </p>
                    )}
                  </div>
                )}

                {/* Total Charge display when not free */}
                {!isFreeDelivery && mailForm.productIds.length > 0 && (
                  <div className="p-3 rounded-lg bg-secondary border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body text-muted-foreground">Total Charge:</span>
                      <span className="text-lg font-display font-bold text-foreground">
                        ₹{detectedCombos.length > 0 ? cartCalc.total : mailForm.productIds.reduce((sum, id) => {
                          const price = parseFloat(customPrices[id] || "0");
                          return sum + (isNaN(price) ? 0 : price);
                        }, 0)}{detectedCombos.length > 0 && cartCalc.discount > 0 && (
                          <span className="text-sm text-emerald-500 ml-2 font-normal">saved ₹{cartCalc.discount}</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="gradient"
                  className="w-full mt-2"
                  onClick={handleSendMail}
                  disabled={isSendingMail}
                >
                  {isSendingMail ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> {isFreeDelivery ? "Send Free Download Email" : "Send Paid Download Email"}</>
                  )}
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-body">
                  <strong className="text-purple-400">How it works:</strong> This creates an admin order and triggers the PDF delivery system.
                  The student will receive a watermarked, password-protected PDF with their phone number as the password.
                  {!isFreeDelivery && " A GST invoice will be attached to the email."}
                </p>
              </div>
            </motion.div>
          )}

          {/* Wiki Tab */}
          {activeTab === "wiki" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Medical Wiki Articles
                </h2>
                <Button asChild variant="gradient">
                  <Link to="/admin/wiki-editor/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New Wiki Article
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                         <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Article
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          App
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {articles.map((article) => (
                        <tr key={article.id} className="hover:bg-secondary/50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-body font-medium text-foreground">
                                {article.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                /{article.slug}
                              </p>
                            </div>
                          </td>
                           <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs bg-primary/20 text-primary-foreground rounded-full border border-primary/30">
                              {medicalApps.find(a => a.id === article.app_id)?.name || article.app_id || "MedOrtho"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs bg-secondary rounded-full">
                              {article.category}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${article.published
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                                }`}
                            >
                              {article.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground font-body">
                            {new Date(article.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <Link to={`/admin/wiki-editor/${article.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={async () => {
                                  if (confirm("Delete this wiki article?")) {
                                    await (supabase as any).from("articles").delete().eq("id", article.id);
                                    loadData();
                                  }
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {articles.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No wiki articles yet. Click 'New Wiki Article' to begin.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Admin;
