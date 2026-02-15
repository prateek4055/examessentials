import { posters } from "../data/posters";

const categories: string[] = Array.from(new Set(posters.map((p) => p.category))).sort();

interface MedPosterCategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const MedPosterCategoryFilter = ({ selected, onSelect }: MedPosterCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onSelect("All")}
        className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
          selected === "All"
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            selected === category
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MedPosterCategoryFilter;
