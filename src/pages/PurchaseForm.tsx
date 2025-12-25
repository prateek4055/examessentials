import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProductById, createOrder, Product } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const purchaseSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Please enter a valid phone number"),
  studentClass: z.string().min(1, "Please select your class"),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

// Combo configuration
const comboConfig: Record<string, { label: string; subjects: string[]; originalPrice: number }> = {
  "single": { label: "Single Subject", subjects: [], originalPrice: 0 },
  "phy-chem": { label: "Physics + Chemistry Combo", subjects: ["Physics", "Chemistry"], originalPrice: 149 },
  "pcm": { label: "PCM Combo", subjects: ["Physics", "Chemistry", "Mathematics"], originalPrice: 199 },
  "pcb": { label: "PCB Combo", subjects: ["Physics", "Chemistry", "Biology"], originalPrice: 209 },
  "pcmb": { label: "PCMB Combo", subjects: ["Physics", "Chemistry", "Mathematics", "Biology"], originalPrice: 259 },
};

const PurchaseForm = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get combo info from URL
  const comboType = searchParams.get("combo") || "single";
  const comboPrice = parseInt(searchParams.get("price") || "0");
  const combo = comboConfig[comboType] || comboConfig["single"];
  const isCombo = comboType !== "single";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      studentClass: "",
    },
  });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      const data = await fetchProductById(id);
      setProduct(data);
      if (data) {
        setValue("studentClass", data.class);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFinalPrice = () => {
    if (isCombo && comboPrice > 0) return comboPrice;
    return product?.price || 0;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground font-body">
            Loading...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <Button asChild variant="outline">
              <Link to="/products">Browse All Notes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      // Create order in database with combo price
      await createOrder({
        product_id: product.id,
        student_name: data.fullName,
        email: data.email,
        phone: data.phone,
        class: data.studentClass,
        amount: getFinalPrice(),
      });

      toast({
        title: "Order Created!",
        description: "Redirecting to payment gateway...",
      });

      // Placeholder: In production, redirect to actual Razorpay payment link
      setTimeout(() => {
        toast({
          title: "Payment Gateway",
          description:
            "Razorpay integration will redirect you to complete payment. Contact admin for PDF delivery.",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Purchase {product.title} | Exam Essentials</title>
        <meta
          name="description"
          content={`Complete your purchase of ${product.title} - Premium handwritten notes for Class ${product.class}.`}
        />
      </Helmet>

      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Complete Your Purchase
              </h1>
              <p className="font-body text-muted-foreground mb-8">
                Fill in your details to proceed with payment.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-body">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className="bg-card border-border focus:border-gold"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive font-body">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className="bg-card border-border focus:border-gold"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive font-body">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-body">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("phone")}
                    className="bg-card border-border focus:border-gold"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive font-body">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label className="font-body">Class</Label>
                  <Select
                    defaultValue={product.class}
                    onValueChange={(value) => setValue("studentClass", value)}
                  >
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.studentClass && (
                    <p className="text-sm text-destructive font-body">
                      {errors.studentClass.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="gradient"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </Button>

                <p className="text-xs text-muted-foreground text-center font-body flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" />
                  Secure payment via Razorpay
                </p>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="sticky top-28 p-6 rounded-2xl bg-card border border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Combo Badge */}
                {isCombo && (
                  <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 text-accent">
                      <Tag className="w-4 h-4" />
                      <span className="font-body font-semibold text-sm">{combo.label}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {isCombo ? (
                    // Show combo subjects
                    combo.subjects.map((subject, index) => (
                      <div key={index} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                        <div>
                          <p className="font-body font-medium text-foreground">
                            {subject} Notes
                          </p>
                          <p className="text-sm text-muted-foreground font-body">
                            Class {product.class} • Full Chapter Notes
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{Math.round(combo.originalPrice / combo.subjects.length)}
                        </span>
                      </div>
                    ))
                  ) : (
                    // Show single product
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-body font-medium text-foreground">
                          {product.title}
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          {product.subject} • Class {product.class}
                        </p>
                      </div>
                      <span className="font-body font-medium text-foreground">
                        ₹{product.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Discount Section for Combo */}
                {isCombo && (
                  <div className="border-t border-border pt-4 mb-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-body text-muted-foreground">Subtotal</span>
                      <span className="font-body text-muted-foreground line-through">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-body text-green-500">Combo Discount</span>
                      <span className="font-body text-green-500">
                        -₹{combo.originalPrice - getFinalPrice()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-muted-foreground">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-foreground">
                        ₹{getFinalPrice()}
                      </span>
                      {isCombo && (
                        <p className="text-xs text-green-500 font-body">
                          You save ₹{combo.originalPrice - getFinalPrice()}!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground font-body">
                    After payment, {isCombo ? "all PDFs" : "your PDF"} will be delivered to your email
                    within 5 minutes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PurchaseForm;
