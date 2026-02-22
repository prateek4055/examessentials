import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClayCardProps extends HTMLMotionProps<"div"> {
    variant?: "flat" | "floating" | "inner";
    hoverEffect?: boolean;
}

export const ClayCard = ({
    className,
    variant = "floating",
    hoverEffect = false,
    children,
    ...props
}: ClayCardProps) => {
    const baseStyles = "bg-[#F4F7FB] rounded-3xl transition-all duration-300";

    const variants = {
        flat: "shadow-clay-sm",
        floating: "shadow-clay-md",
        inner: "shadow-clay-inner bg-[#F4F7FB]/50",
    };

    const hoverStyles = hoverEffect
        ? "hover:-translate-y-1 hover:shadow-clay-lg active:shadow-clay-inner active:translate-y-0"
        : "";

    return (
        <motion.div
            className={cn(baseStyles, variants[variant], hoverStyles, className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            {...props}
        >
            {children}
        </motion.div>
    );
};
