"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
  maskImage?: string; // New prop for mask image
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
  maskImage, // Destructure the maskImage prop
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);

  const triggerAnimation = () => {
    interations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                ? text[i]
                : alphabets[getRandomInt(26)],
            ),
          );
          interations.current = interations.current + 0.1;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 10),
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad]);

  return (
    <div
      className={cn(
        "relative flex justify-center items-center overflow-hidden py-2 cursor-default text-transparent bg-clip-text", // Ensures text inherits the background
        className,
      )}
      style={{
        backgroundImage: maskImage ? `url(${maskImage})` : undefined, // Single background for all text
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center -20px",
      }}
      onMouseEnter={triggerAnimation}
    >
      {displayText.map((letter, i) => (
        <motion.h1
          key={i}
          className={cn("font-mono", letter === " " ? "w-3" : "")} // Letter-specific styles
          {...framerProps}
        >
          {letter.toUpperCase()}
        </motion.h1>
      ))}
    </div>
  );
}
