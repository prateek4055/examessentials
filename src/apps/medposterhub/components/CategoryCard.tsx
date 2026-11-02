interface CategoryCardProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    count?: number;
}

export const CategoryCard = ({ label, isActive, onClick, count }: CategoryCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5
                ${isActive
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }
            `}
        >
            <span>{label}</span>
            {count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                    {count}
                </span>
            )}
        </button>
    );
};
