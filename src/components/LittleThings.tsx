import TextRevealByWord from "./ui/text-reveal";
import SparklesText from "./ui/sparkles-text";

export function LittleThings() {
  return (
    <div className="relative text-lg text-black dark:text-white p-6 space-y-8">
      <TextRevealByWord>
        {"When you are not the tallest/fastest/strongest, you have to find ways to affect every game you play with what coaches like to call, "}
        <SparklesText text="the little things" />
      </TextRevealByWord>
    </div>
  );
}

export default LittleThings;
