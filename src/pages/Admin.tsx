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
import logo from "@/assets/logo.jpeg";

type Tab = "products" | "orders";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        fetchAllProducts(),
        fetchAllOrders(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground font-body">Loading...</div>
      </div>
    );
  }

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
                              className={`px-2 py-1 text-xs rounded-full ${
                                product.published
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
                              className={`px-2 py-1 text-xs rounded-full ${
                                order.payment_status === "completed"
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
        </main>
      </div>
    </>
  );
};

export default Admin;
