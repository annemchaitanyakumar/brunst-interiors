import kitchen from "@/assets/room-kitchen.webp";
import bath from "@/assets/room-bath.webp";
import { ScrubWords } from "@/components/site/text";
import { RevealImage } from "@/components/site/media";

export function Philosophy() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="text-eyebrow text-bronze md:col-span-3">(01) — Philosophy</p>
        <ScrubWords
          className="text-display-md md:col-span-9"
          text="We compose rooms like scenes — light as the protagonist, material as memory, and every object with a reason to stay."
        />
      </div>

      <div className="mt-24 grid gap-6 md:mt-40 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <RevealImage src={kitchen} alt="Travertine kitchen island with smoked oak joinery" className="aspect-[4/5] md:aspect-[5/6]" from="center" view />
          <div className="mt-4 flex justify-between text-eyebrow text-muted-foreground">
            <span>The Travertine Kitchen</span>
            <span>Jubilee Hills</span>
          </div>
        </div>
        <div className="flex flex-col justify-end md:col-span-5">
          <p className="mb-10 max-w-sm text-base leading-relaxed text-muted-foreground md:mb-16">
            For nearly two decades, Brunst Interiors has shaped private residences, hotels and ateliers across India — each one
            built slowly, by hand, around the way its people actually live.
          </p>
          <RevealImage src={bath} alt="Skylit stone bathtub in a microcement bathroom" className="aspect-[3/4]" from="bottom" view />
          <div className="mt-4 flex justify-between text-eyebrow text-muted-foreground">
            <span>Atelier Bath</span>
            <span>Goa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
