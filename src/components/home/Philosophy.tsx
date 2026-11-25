import kitchen from "@/assets/room-kitchen.webp";
import bath from "@/assets/room-bath.webp";
import { ScrubWords } from "@/components/site/text";
import { RevealImage } from "@/components/site/media";
import { TransitionLink } from "@/components/site/Curtain";

export function Philosophy() {
  return (
    <section className="px-6 py-16 md:px-12 md:py-44">
      <ScrubWords
        className="text-display-md max-w-5xl"
        text="We compose rooms like scenes — light as the protagonist, material as memory, and every object with a reason to stay."
      />

      <div className="mt-14 grid gap-8 md:mt-40 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <TransitionLink
            to="/projects"
            search={{ open: "travertine-kitchen" }}
            className="group block"
            aria-label="Open case study: The Travertine Kitchen"
          >
            <RevealImage
              src={kitchen}
              alt="Travertine kitchen island with smoked oak joinery"
              className="aspect-[4/5] md:aspect-[5/6]"
              imgClassName="transition-[filter] duration-700 group-hover:brightness-105"
              from="center"
              view
            />
            <div className="mt-4 flex justify-between text-eyebrow text-muted-foreground transition-colors group-hover:text-charcoal">
              <span>The Travertine Kitchen</span>
              <span>Jubilee Hills</span>
            </div>
          </TransitionLink>
        </div>
        <div className="flex flex-col justify-end md:col-span-5">
          <p className="mb-10 max-w-sm text-base leading-relaxed text-muted-foreground md:mb-16">
            For nearly two decades, Brunst Interiors has shaped private residences, hotels and ateliers across India — each one
            built slowly, by hand, around the way its people actually live.
          </p>
          <TransitionLink
            to="/projects"
            search={{ open: "atelier-bath" }}
            className="group block"
            aria-label="Open case study: Atelier Bath"
          >
            <RevealImage
              src={bath}
              alt="Skylit stone bathtub in a microcement bathroom"
              className="aspect-[3/4]"
              imgClassName="transition-[filter] duration-700 group-hover:brightness-105"
              from="bottom"
              view
            />
            <div className="mt-4 flex justify-between text-eyebrow text-muted-foreground transition-colors group-hover:text-charcoal">
              <span>Atelier Bath</span>
              <span>Goa</span>
            </div>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
