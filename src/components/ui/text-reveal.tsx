"use client";

import React, { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  children: ReactNode;
  className?: string;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  children,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Flatten all children into an array of words and components.
  const elements: ReactNode[] = React.Children.toArray(children).flatMap((child) => {
    if (typeof child === "string") {
      return child.split(" ").map((word) => `${word} `); // Keep space after each word.
    }
    return child;
  });

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[150vh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[40%] max-w-4xl items-center bg-transparent px-4 py-10"
        }
      >
        <div
          className={
            "flex flex-wrap p-4 text-2xl font-bold text-black/20 dark:text-white/20 md:p-6 md:text-3xl lg:p-6 lg:text-4xl xl:text-5xl"
          }
        >
          {elements.map((element, index) => {
            const start = index / elements.length;
            const end = (index + 1) / elements.length;
            return (
              <Word key={index} progress={scrollYProgress} range={[start, end]}>
                {element}
              </Word>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <motion.span
      style={{ opacity: opacity }}
      className={"text-black dark:text-white mx-1 lg:mx-2.5 inline-block"}
    >
      {children}
    </motion.span>
  );
};

export default TextRevealByWord;
