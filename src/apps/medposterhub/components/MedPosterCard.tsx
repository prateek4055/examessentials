import { Poster } from "../data/posters";

interface MedPosterCardProps {
  poster: Poster;
  onClick: () => void;
  index: number;
}

const MedPosterCard = ({ poster, onClick, index }: MedPosterCardProps) => {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={poster.image}
          alt={poster.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {poster.category}
        </span>
        <h3 className="mb-1 font-semibold text-card-foreground line-clamp-1">
          {poster.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          From ₹{poster.price.small}
        </p>
        <button
          className="mt-3 w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://wa.me/919460970342?text=Hi,%20I%20want%20to%20order%20the%20${encodeURIComponent(poster.title)}%20(${encodeURIComponent(poster.sizes[0])})`,
              "_blank"
            );
          }}
        >
          Order on WhatsApp
        </button>
        <ul className="mt-2 text-xs text-muted-foreground">
          {poster.sizes.map((size) => (
            <li key={size}>• {size}</li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default MedPosterCard;
