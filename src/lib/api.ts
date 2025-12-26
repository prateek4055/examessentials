import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Order validation schema
const orderSchema = z.object({
  product_id: z.string().uuid().nullable(),
  student_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().regex(/^[0-9+\-\s()]{10,15}$/, "Invalid phone number format"),
  class: z.enum(["11", "12"], { errorMap: () => ({ message: "Class must be 11 or 12" }) }),
  amount: z.number().int().positive("Amount must be a positive number"),
  user_id: z.string().uuid().nullable().optional()
});

export type ProductCategory = "formula-sheet" | "mindmaps" | "handwritten-notes" | "pyqs";

export interface Product {
  id: string;
  title: string;
  class: "11" | "12";
  subject: string;
  category: ProductCategory;
  description: string;
  price: number;
  pdf_url?: string | null;
  images?: string[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  product_id: string | null;
  user_id: string | null;
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

// Create order (public - supports both guest and authenticated users)
export const createOrder = async (
  order: Omit<Order, "id" | "created_at" | "payment_status" | "user_id">
): Promise<Order> => {
  // Get current user if authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // Validate input before database insertion
  const validatedOrder = orderSchema.parse({
    ...order,
    user_id: user?.id || null
  });

  const { data, error } = await supabase
    .from("orders")
    .insert({
      product_id: validatedOrder.product_id,
      user_id: validatedOrder.user_id,
      student_name: validatedOrder.student_name,
      email: validatedOrder.email,
      phone: validatedOrder.phone,
      class: validatedOrder.class,
      amount: validatedOrder.amount,
      payment_status: "pending" as const
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Order;
};

// Fetch all orders (admin only - excludes guest orders)
export const fetchAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    // PostgREST syntax for NOT NULL is: user_id=not.is.null
    // Passing "null" as a string reliably generates that filter.
    .not("user_id", "is", "null")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  // Extra guard (in case some older rows have null/empty user_id)
  return ((data || []) as Order[]).filter((o) => Boolean(o.user_id));
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
