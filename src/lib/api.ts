import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  title: string;
  class: "11" | "12";
  subject: string;
  description: string;
  price: number;
  pdf_url?: string | null;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  product_id: string | null;
  student_name: string;
  email: string;
  phone: string;
  class: string;
  amount: number;
  payment_status: "pending" | "completed" | "failed";
  created_at: string;
}

// Fetch all published products (public)
export const fetchPublishedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return (data || []) as Product[];
};

// Fetch all products (admin only)
export const fetchAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }

  return (data || []) as Product[];
};

// Fetch single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data as Product | null;
};

// Create new product (admin only)
export const createProduct = async (
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data as Product;
};

// Update product (admin only)
export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
): Promise<Product> => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return data as Product;
};

// Delete product (admin only)
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Create order (public)
export const createOrder = async (
  order: Omit<Order, "id" | "created_at" | "payment_status">
): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...order, payment_status: "pending" })
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    throw error;
  }

  return data as Order;
};

// Fetch all orders (admin only)
export const fetchAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  return (data || []) as Order[];
};

// Update order status (admin only)
export const updateOrderStatus = async (
  id: string,
  payment_status: "pending" | "completed" | "failed"
): Promise<Order> => {
  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error);
    throw error;
  }

  return data as Order;
};
