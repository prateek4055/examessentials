import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, FileText, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockProducts";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = mockProducts.find((p) => p.id === id);

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

  const features = [
    "Handwritten for better retention",
    "Exam-focused content only",
    "Clear diagrams & flowcharts",
    "Quick revision summaries",
    "Instant PDF delivery",
  ];

  return (
    <>
      <Helmet>
        <title>{product.title} | Exam Essentials</title>
        <meta
          name="description"
          content={`${product.title} - ${product.description}. Premium handwritten notes for Class ${product.class} ${product.subject}.`}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Product Image / Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-card to-secondary border border-border flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gradient-purple to-gradient-blue flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-foreground" />
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mb-2">
                    {product.subject}
                  </p>
                  <p className="text-muted-foreground font-body">
                    Premium Handwritten Notes
                  </p>
                </div>
              </div>

              {/* Class Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 text-sm font-body font-medium bg-secondary text-secondary-foreground rounded-full border border-border">
                  Class {product.class}
                </span>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Subject */}
              <p className="text-sm font-body text-gold uppercase tracking-wider mb-2">
                {product.subject}
              </p>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.title}
              </h1>

              {/* Description */}
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="font-body text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">
                      One-time payment
                    </p>
                    <p className="text-4xl font-display font-bold text-foreground">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                <Button asChild variant="gradient" size="xl" className="w-full">
                  <Link to={`/purchase/${product.id}`}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4 font-body">
                  Secure payment via Razorpay. Instant PDF delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
