import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal = ({ isOpen, onClose }: PaymentSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-gold/20 bg-card"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader className="text-center sm:text-center">
          {/* Success Animation */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20"
              />
              
              {/* Middle ring with pulse */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/30"
              />
              
              {/* Inner circle with checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.4,
                }}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <Check className="w-12 h-12 text-white stroke-[3]" />
                </motion.div>
              </motion.div>
              
              {/* Confetti particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0, 
                    x: 0, 
                    y: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
                    y: Math.sin((i * Math.PI * 2) / 8) * 60,
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    delay: 0.5 + i * 0.05, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${
                    i % 3 === 0 
                      ? "bg-gold" 
                      : i % 3 === 1 
                        ? "bg-green-400" 
                        : "bg-emerald-500"
                  }`}
                  style={{ marginLeft: -6, marginTop: -6 }}
                />
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <DialogTitle className="text-2xl font-display font-bold text-foreground text-center">
              Payment Successful 🎉
            </DialogTitle>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <DialogDescription className="text-base text-muted-foreground font-body text-center mt-4 leading-relaxed">
              Please wait up to 5 minutes. Your purchased notes will be sent to your registered Gmail. Please check Spam/Promotions if not found.
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-6"
        >
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-primary-foreground font-body font-semibold py-6 text-lg"
          >
            I Understand
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
