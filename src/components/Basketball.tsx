import { useState } from "react";
import { Button } from "./ui/button";
import BoxReveal from "./ui/box-reveal";
import Games from "./Games";
import { motion, AnimatePresence } from "framer-motion";

export function Basketball() {
  const [showGames, setShowGames] = useState(false);

  const handleButtonClick = () => {
    setShowGames(!showGames);
  };

  return (
    <div className="relative flex flex-col md:flex-row size-full max-w-full items-start md:items-center justify-between overflow-hidden pt-8 text-black dark:text-white p-6 space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Section: Text */}
      <div className="md:w-1/2 space-y-8">
        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <p className="text-[2rem] font-semibold">
            Growing up, I ate/slept/breathed basketball.
          </p>
        </BoxReveal>

        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <h2 className="mt-[.5rem] text-[1.5rem]">
            One of the things I love the most about sports is that between the lines of every game,
          </h2>
        </BoxReveal>

        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <div className="mt-6">
            <p className="text-[1.25rem]">
              there is a story being told with{" "}
              <span className="font-semibold text-[#5046e6]">NUMBERS</span> and{" "}
              <span className="font-semibold text-[#5046e6]">EFFICIENCY</span>.
            </p>
          </div>
        </BoxReveal>

        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
          <Button className="mt-[1.6rem] bg-[#5046e6]" onClick={handleButtonClick}>
            Explore Basketball Stats
          </Button>
        </BoxReveal>
      </div>

      {/* Right Section: Games with AnimatePresence */}
      <div className="md:w-1/2 space-y-4">
        <AnimatePresence>
          {showGames && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Games />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Basketball;
