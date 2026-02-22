import { ClayButton } from "./ClayButton";

interface CategoryCardProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const CategoryCard = ({ label, isActive, onClick }: CategoryCardProps) => {
    return (
        <ClayButton
            variant={isActive ? "primary" : "secondary"}
            isActive={isActive}
            onClick={onClick}
            className={`
                px-6 py-3 rounded-full text-sm font-bold min-w-[max-content] transition-all duration-300
                ${isActive
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] ring-2 ring-blue-600/20 scale-105"
                    : "bg-[#F4F7FB] text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-clay-sm"
                }
            `}
        >
            {label}
        </ClayButton>
    );
};
