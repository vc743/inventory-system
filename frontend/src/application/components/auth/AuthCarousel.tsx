import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "cn";
import warehouse1 from "@/assets/auth/warehouse-1.webp";
import warehouse2 from "@/assets/auth/warehouse-2.webp";
import warehouse3 from "@/assets/auth/warehouse-3.webp";

const SLIDES = [
  {
    image: warehouse1,
    quote: "Los planes no valen nada; la planificación lo es todo.",
    author: "Dwight D. Eisenhower",
  },
  {
    image: warehouse3,
    quote:
      "La eficiencia es hacer las cosas bien; la eficacia es hacer las cosas correctas.",
    author: "Peter Drucker",
  },
  {
    image: warehouse2,
    quote: "El orden es el placer de la razón.",
    author: "Paul Claudel",
  },
];

const INTERVAL_MS = 5000;

const AuthCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Un timeout por slide: cambiar de imagen (sola o con los botones)
  // reinicia la cuenta, así un clic nunca va seguido de un salto inmediato.
  useEffect(() => {
    if (paused) return;
    const timeout = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearTimeout(timeout);
  }, [index, paused]);

  const go = (step: number) =>
    setIndex((i) => (i + step + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Citas sobre organización"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-full overflow-hidden rounded-2xl bg-neutral-900"
    >
      {/* Todas las imágenes apiladas: solo cambia la opacidad (crossfade). */}
      {SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          decoding="async"
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out motion-reduce:duration-300",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Degradado para que el texto se lea sobre cualquier foto. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />

      <span className="absolute top-8 left-8 font-heading text-lg font-semibold text-white">
        StockFlow
      </span>

      <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-8">
        {/* La key fuerza a React a remontar el bloque y repetir la entrada. */}
        <figure key={index} className="max-w-md animate-stagger-in">
          <blockquote className="font-heading text-2xl leading-snug font-medium text-balance text-white">
            “{slide.quote}”
          </blockquote>
          <figcaption className="mt-4 text-sm text-white/70">
            {slide.author}
          </figcaption>
        </figure>

        <div className="flex shrink-0 gap-2">
          <CarouselButton label="Cita anterior" onClick={() => go(-1)}>
            <ArrowLeft />
          </CarouselButton>
          <CarouselButton label="Cita siguiente" onClick={() => go(1)}>
            <ArrowRight />
          </CarouselButton>
        </div>
      </div>
    </section>
  );
};

const CarouselButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-[background-color,scale] duration-150 ease-out outline-none hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white active:scale-[0.96] [&_svg]:size-4"
  >
    {children}
  </button>
);

export default AuthCarousel;
