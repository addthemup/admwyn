import { motion } from "framer-motion";
import BlurFade from "./ui/blur-fade";
import HyperText from "./ui/hyper-text";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function HeroHeader() {
  return (
    <motion.section
      id="header"
      className="relative text-4xl font-bold text-black dark:text-white p-6 flex flex-col items-center justify-center min-h-screen overflow-hidden"
    >
      {/* Background image for the initial load */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('./awc_anime.png')",
        }}
        initial={{
          opacity: 1, // Fully visible at the start
        }}
        animate={{
          opacity: 0, // Fade out completely
        }}
        transition={{
          duration: 3, // Smooth fade-out
          ease: "easeInOut",
        }}
      />

      {/* Content after background fades out */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -200 }} // Start invisible and 200px lower
        animate={{
          opacity: 1,
          y: 0, // Move to default position
        }}
        transition={{
          delay: 3, // Wait until the background is gone
          duration: 1, // Smooth transition
          ease: "easeInOut",
        }}
      >
        {/* Animated Avatar */}
        <motion.div
          className="mb-6"
          initial={{
            scale: 5, y: -200 // Start zoomed in
          }}
          animate={{
            scale: 1, // Zoom out to normal size
          }}
          transition={{
            duration: 3, // Smooth animation duration
            ease: "easeInOut",
            delay: 3, // Synchronize with background removal
          }}
        >
          <Avatar className="w-56 h-56">
            <AvatarImage src="./awc_profile.jpg" alt="Adam Wayne Carver" />
            <AvatarFallback>AWC</AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Hero Header Text with Upward Movement */}
        <motion.div
          className="text-center"
          initial={{ y: -200 }} // Start 200px lower
          animate={{ y: 0 }} // Move to default position
          transition={{
            delay: 3.5, // After background fade and avatar animation
            duration: 1, // Smooth transition
            ease: "easeInOut",
          }}
        >
          <BlurFade delay={3.5} inView maskImage="./awc_anime.png">
            <h2 className="tracking-tight">
              Hello. My name is{" "}
              <HyperText text="Adam Wayne Carver" maskImage="./awc_anime.png" />
            </h2>
          </BlurFade>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default HeroHeader;
