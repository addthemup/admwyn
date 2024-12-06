import TextRevealByWord from "./ui/text-reveal";

export function Grow() {
  return (
    <div className="relative text-lg text-black dark:text-white p-6 space-y-8 z-1">
      <TextRevealByWord>
        {"I love to build/create/plant things and help them grow."}
      </TextRevealByWord>
    </div>
  );
}

export default Grow;
