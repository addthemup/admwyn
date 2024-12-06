import React, { useState, useEffect } from "react";
import BoxReveal from "./ui/box-reveal";
import { motion } from "framer-motion";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import Whip from "./Whip";
import WRC from "./WRC";

export function Baseball() {
  const [boxRevealComplete, setBoxRevealComplete] = useState(false);

  useEffect(() => {
    // Set a timeout to mark when all BoxReveal animations are complete
    const totalAnimationDuration = 3 * 1000; // 3 seconds for the last BoxReveal
    const timeout = setTimeout(() => setBoxRevealComplete(true), totalAnimationDuration);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row size-full max-w-[1200px] mx-auto items-start md:items-center justify-between overflow-hidden pt-8 text-black dark:text-white p-6 space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Section: Intro */}
      <div
        className="w-full md:w-[500px] space-y-6"
        style={{ minHeight: "600px", maxHeight: "600px" }}
      >
        <motion.div
          key="intro"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <BoxReveal boxColor={"#5046e6"} duration={1}>
            <p className="text-[1.5rem] font-semibold">
              Growing up, I ate/slept/breathed baseball.
            </p>
          </BoxReveal>
          <BoxReveal boxColor={"#5046e6"} duration={2}>
            <h2 className="mt-[.5rem] text-[1.5rem]">
              One of the things I love the most about sports is that between the lines of every
              game,
            </h2>
          </BoxReveal>
          <BoxReveal boxColor={"#5046e6"} duration={3}>
            <div className="mt-6">
              <p className="text-[1.25rem]">
                there is a story being told with{" "}
                <Popover>
                  <PopoverTrigger asChild>
                    <span
                      className="font-semibold text-[#5046e6] cursor-pointer underline"
                      role="button"
                    >
                      NUMBERS
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{
                      minWidth: "600px",
                      backgroundColor: "white", // Fully opaque background
                      zIndex: 1050, // Higher z-index
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow for visibility
                    }}
                  >
                    <WRC />
                  </PopoverContent>
                </Popover>{" "}
                and{" "}
                <Popover>
                  <PopoverTrigger asChild>
                    <span
                      className="font-semibold text-[#5046e6] cursor-pointer underline"
                      role="button"
                    >
                      EFFICIENCY
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{
                      minWidth: "600px",
                      backgroundColor: "white", // Fully opaque background
                      zIndex: 1050, // Higher z-index
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Add shadow for visibility
                    }}
                  >
                    <Whip />
                  </PopoverContent>
                </Popover>
                .
              </p>
            </div>
          </BoxReveal>
        </motion.div>
      </div>

      {/* Right Section: Diamond.svg */}
      <div
        className="w-full md:w-[500px] flex items-center justify-center z-10"
        style={{ minHeight: "600px", maxHeight: "600px", marginTop: "100px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -200, scale: 0.5 }}
          animate={{
            opacity: boxRevealComplete ? 1 : 0,
            scale: boxRevealComplete ? 1 : 0.5,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative z-20"
        >
          <img
            src="/diamond.svg"
            alt="Baseball Diamond"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Baseball;
