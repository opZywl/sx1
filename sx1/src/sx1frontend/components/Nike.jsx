import DotPattern from "@/components/ui/dot-pattern";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Nike = () => {
  return (
    <div className="h-[90vh] max-h-[900px] relative flex items-center justify-center group ">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="relative max-w-7xl h-full w-full flex items-center justify-center max-sm:items-end">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="absolute top-10 left-10 z-20">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0 }}
            className="font-mono font-extrabold lg:text-[7rem] text-6xl"
          >
            <h2 className="bg-gradient-to-b from-zinc-200 font-mono to-zinc-600 bg-clip-text leading-none text-transparent">
              SX1 IMPORTS{" "}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-3xl font-bold font-mono bg-white text-black w-[70%]"
          >
            TOP 01 EM IMPORTS
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute w-1 font-bold font-mono flex-col flex max-sm:flex-row  max-sm:w-max max-sm:bottom-10 max-sm:left-10 items-center justify-center right-20 bottom-56 text-3xl"
        >
          <span>C</span>
          <span>A</span>
          <span>M</span>
          <span>I</span>
          <span>S</span>
          <span>A</span>
          <span>S</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.75 }}
          className="absolute w-1 font-bold font-mono flex-col max-sm:flex-row  max-sm:w-max max-sm:bottom-10 flex items-center justify-center right-10 bottom-5 text-3xl"
        >
          <span>W</span>
          <span>O</span>
          <span>R</span>
          <span>L</span>
          <span>D</span>
          <span>&nbsp;</span>
          <span>C</span>
          <span>L</span>
          <span>A</span>
          <span>S</span>
          <span>S</span>
        </motion.div>
        
        <motion.img
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.25 }}
          src="/images/brasil.png"
          alt=""
          className="w-[100%] object-contain z-10 max-sm:my-36 mt-48"
        />
      </div>
    </div>
  );
};

export default Nike;
