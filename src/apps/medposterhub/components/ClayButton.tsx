import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "icon";
    isActive?: boolean;
    asChild?: boolean;
}

export const ClayButton = ({
    className,
    variant = "primary",
    isActive = false,
    asChild = false,
    children,
    ...props
}: ClayButtonProps) => {
    const Component = asChild ? Slot : motion.button;
    const baseStyles = "relative inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-95 active:shadow-clay-inner";

    const variants = {
        primary: "bg-blue-500 text-white shadow-clay-btn hover:bg-blue-600",
        secondary: "bg-[#F4F7FB] text-slate-700 shadow-clay-btn hover:text-blue-600",
        icon: "p-3 rounded-full bg-[#F4F7FB] text-slate-700 shadow-clay-btn hover:text-blue-600",
    };

    const activeStyles = isActive ? "shadow-clay-inner text-blue-600 scale-95" : "";

    return (
        <Component
            {...(!asChild ? {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
            } : {})}
            className={cn(baseStyles, variants[variant], activeStyles, className)}
            {...props as any}
        >
            {children}
        </Component>
    );
};
