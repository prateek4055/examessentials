import { Link } from "react-router-dom";
import { ArrowUpRight, Star, ShieldCheck } from "lucide-react";
import { Poster } from "@/apps/medposterhub/data/posters";

interface PosterCardProps {
  poster: Poster;
}

export const PosterCard = ({ poster }: PosterCardProps) => {
  return (
    <Link
      to={`/medposterhub/${poster.slug}`}
      className="group block rounded-[1.75rem] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 bg-card/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] hover:border-primary/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)]"
    >
      {/* Full Image Container — Uncropped display */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-zinc-900/70 dark:to-zinc-950 overflow-hidden aspect-[3/4] p-3 sm:p-4 flex items-center justify-center">
        <img
          src={poster.image}
          alt={poster.title}
          loading="lazy"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.14)] group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />

        {/* Bestseller Badge */}
        <span className="absolute top-3 right-3 backdrop-blur-md bg-emerald-600/90 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Clinical Chart
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-secondary rounded-full text-muted-foreground">
            {poster.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{poster.rating || 4.9}</span>
          </div>
        </div>

        <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-1 mb-1.5 group-hover:text-primary transition-colors leading-snug">
          {poster.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {poster.description}
        </p>

        <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
          <div>
            <span className="text-xs text-muted-foreground block text-[10px] uppercase tracking-wider">Starting at</span>
            <span className="text-base md:text-lg font-bold text-foreground">
              ₹{poster.price.small}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <span>View Poster</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PosterCard;

