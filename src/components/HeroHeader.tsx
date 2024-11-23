import BlurFade from "./ui/blur-fade";
import HyperText from "./ui/hyper-text";

export function HeroHeader() {
  return (
    <section id="header" className="relative text-4xl font-bold text-black dark:text-white p-6">
      <BlurFade delay={0.25} inView>
        <h2 className="tracking-tight">
          Hello. My name is <HyperText text="Adam Wayne Carver" />
        </h2>
      </BlurFade>
    </section>
  );
}

export default HeroHeader;
