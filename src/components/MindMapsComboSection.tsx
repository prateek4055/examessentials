import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";

export interface MindMapCombo {
  id: string;
  name: string;
  subjects: string[];
  price: number;
  originalPrice: number;
  badge?: string;
  badgeType?: "best-value" | "popular" | "new";
}

// Mind Maps specific combos - easily extendable
export const mindMapCombos: Record<string, MindMapCombo[]> = {
  "12": [
    {
      id: "pcb-mindmaps-12",
      name: "PCB Mind Maps Combo",
      subjects: ["Physics", "Chemistry", "Biology"],
      price: 299,
      originalPrice: 447,
      badge: "Best Value",
      badgeType: "best-value",
    },
    {
      id: "phy-chem-mindmaps-12",
      name: "Physics + Chemistry Combo",
      subjects: ["Physics", "Chemistry"],
      price: 249,
      originalPrice: 298,
      badge: "Most Popular",
      badgeType: "popular",
    },
  ],
  "11": [
    {
      id: "pcb-mindmaps-11",
      name: "PCB Mind Maps Combo",
      subjects: ["Physics", "Chemistry", "Biology"],
      price: 299,
      originalPrice: 447,
      badge: "Best Value",
      badgeType: "best-value",
    },
    {
      id: "phy-chem-mindmaps-11",
      name: "Physics + Chemistry Combo",
      subjects: ["Physics", "Chemistry"],
      price: 249,
      originalPrice: 298,
      badge: "Most Popular",
      badgeType: "popular",
    },
  ],
};

interface MindMapsComboSectionProps {
  currentProduct: Product;
  allProducts: Product[];
  onSelectCombo: (comboProductIds: string[]) => void;
}

const MindMapsComboSection = ({
  currentProduct,
  allProducts,
  onSelectCombo,
}: MindMapsComboSectionProps) => {
  const productClass = currentProduct.class;
  const combos = mindMapCombos[productClass] || [];

  if (combos.length === 0) return null;

  const handleComboSelect = (combo: MindMapCombo) => {
    // Find all Mind Maps products for the combo subjects in the same class
    const comboProducts = allProducts.filter(
      (p) =>
        p.class === productClass &&
        p.category === "mindmaps" &&
        combo.subjects.some(
          (subject) => subject.toLowerCase() === p.subject.toLowerCase()
        )
    );

    const productIds = comboProducts.map((p) => p.id);
    onSelectCombo(productIds);
  };

  const getBadgeStyles = (badgeType?: string) => {
    switch (badgeType) {
      case "best-value":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      case "popular":
        return "bg-accent/20 text-accent border-accent/30";
      case "new":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-secondary text-foreground border-border";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-4xl mx-auto mt-16"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">
            Upgrade & Save
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
          Mind Maps Combo Offers
        </h2>
        <p className="text-muted-foreground font-body max-w-md mx-auto">
          Most students prefer combos for complete revision. Save more when you
          bundle!
        </p>
      </div>

      {/* Combo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo, index) => {
          const savings = combo.originalPrice - combo.price;
          const savingsPercent = Math.round(
            (savings / combo.originalPrice) * 100
          );

          return (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 bg-card border border-border rounded-2xl hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                {/* Badge */}
                {combo.badge && (
                  <div
                    className={`absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeStyles(
                      combo.badgeType
                    )}`}
                  >
                    {combo.badge}
                  </div>
                )}

                {/* Combo Name */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {combo.name}
                </h3>

                {/* Subjects List */}
                <div className="space-y-2 mb-4">
                  {combo.subjects.map((subject) => (
                    <div
                      key={subject}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{subject} Mind Maps</span>
                    </div>
                  ))}
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-display font-bold text-foreground">
                        ₹{combo.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full">
                    <Tag className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-500">
                      Save ₹{savings} ({savingsPercent}% off)
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                  onClick={() => handleComboSelect(combo)}
                >
                  Get This Combo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Microcopy */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        💡 Combos are applied at checkout. You can always modify your selection
        in the cart.
      </p>
    </motion.div>
  );
};

export default MindMapsComboSection;
