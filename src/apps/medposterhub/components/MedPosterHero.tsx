import { posters } from "../data/posters";

const MedPosterHero = () => {
  const strip = posters.concat(posters);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug tracking-tight">
          <span>Professional </span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-2 italic">
            Medical and Clinical
          </span>
          <span>Posters</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground">
          High-resolution, clinically accurate anatomical and educational posters for clinics,
          hospitals and teaching institutes — designed for medical professionals, not children.
        </p>

        {/* Scrolling poster strip */}
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-4 animate-scroll whitespace-nowrap">
            {strip.map((poster, index) => (
              <img
                key={index}
                src={poster.image}
                alt={poster.title}
                className="h-24 sm:h-28 md:h-32 w-auto rounded-lg shadow-md object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#catalog"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm sm:text-base font-medium text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
          >
            Browse catalogue
          </a>
        </div>
      </div>
    </section>
  );
};

export default MedPosterHero;
