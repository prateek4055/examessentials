import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProductById,
  createProduct,
  updateProduct,
  Product,
} from "@/lib/api";
import ProductImageUploader from "@/components/ProductImageUploader";
import logo from "@/assets/logo.jpeg";

const categoryOptions = [
  { value: "handwritten-notes", label: "Handwritten Notes" },
  { value: "formula-sheet", label: "Formula Sheet" },
  { value: "mindmaps", label: "Mindmaps" },
  { value: "pyqs", label: "PYQs" },
];

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  class: z.enum(["11", "12"], { required_error: "Please select a class" }),
  subject: z.string().min(2, "Subject is required").max(100),
  category: z.enum(["formula-sheet", "mindmaps", "handwritten-notes", "pyqs"], { required_error: "Please select a category" }),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
  pdf_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== "new";
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      class: "11",
      subject: "",
      category: "handwritten-notes",
      description: "",
      price: 299,
      pdf_url: "",
      published: false,
    },
  });

  const watchedClass = watch("class");
  const watchedCategory = watch("category");
  const watchedPublished = watch("published");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && isAdmin) {
      loadProduct();
    }
  }, [isEditing, isAdmin]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const product = await fetchProductById(id);
      if (product) {
        reset({
          title: product.title,
          class: product.class,
          subject: product.subject,
          category: product.category,
          description: product.description,
          price: product.price,
          pdf_url: product.pdf_url || "",
          published: product.published,
        });
        setProductImages(product.images || []);
      } else {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive",
        });
        navigate("/admin");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        title: data.title,
        class: data.class as "11" | "12",
        subject: data.subject,
        category: data.category as "formula-sheet" | "mindmaps" | "handwritten-notes" | "pyqs",
        description: data.description,
        price: data.price,
        pdf_url: data.pdf_url || null,
        images: productImages,
        published: data.published,
      };

      if (isEditing && id) {
        await updateProduct(id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
      }
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    }
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
        <title>
          {isEditing ? "Edit Product" : "New Product"} | Exam Essentials Admin
        </title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/admin" className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Exam Essentials"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="font-display text-lg font-semibold text-foreground">
                  Admin Dashboard
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-body">
                  Product Title
                </Label>
                <Input
                  id="title"
                  placeholder="Complete Mechanics Notes"
                  {...register("title")}
                  className="bg-secondary border-border"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Class & Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body">Class</Label>
                  <Select
                    value={watchedClass}
                    onValueChange={(value) => setValue("class", value as "11" | "12")}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.class && (
                    <p className="text-sm text-destructive">{errors.class.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-body">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Physics"
                    {...register("subject")}
                    className="bg-secondary border-border"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="font-body">Category</Label>
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue("category", value as any)}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-body">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Comprehensive handwritten notes covering..."
                  {...register("description")}
                  className="bg-secondary border-border min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="font-body">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="299"
                  {...register("price")}
                  className="bg-secondary border-border"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              {/* PDF URL */}
              <div className="space-y-2">
                <Label htmlFor="pdf_url" className="font-body">
                  PDF URL (Optional)
                </Label>
                <Input
                  id="pdf_url"
                  placeholder="https://drive.google.com/..."
                  {...register("pdf_url")}
                  className="bg-secondary border-border"
                />
                {errors.pdf_url && (
                  <p className="text-sm text-destructive">{errors.pdf_url.message}</p>
                )}
              </div>

              {/* Product Images */}
              <div className="space-y-2">
                <Label className="font-body">Product Images</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload up to 5 product images. The first image will be the main display image.
                </p>
                <ProductImageUploader
                  images={productImages}
                  onImagesChange={setProductImages}
                  maxImages={5}
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                <div>
                  <Label className="font-body font-medium">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this product visible to customers
                  </p>
                </div>
                <Switch
                  checked={watchedPublished}
                  onCheckedChange={(checked) => setValue("published", checked)}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminProductForm;
