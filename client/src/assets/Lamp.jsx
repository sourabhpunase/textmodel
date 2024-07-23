import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../components/Lamp";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-2 bg-gradient-to-br from-slate-300 to-slate-500 py-2 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-4xl"
      > Text Encoder
      <br/>
      

      </motion.h1>
      <motion.h1  className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500  bg-clip-text text-center   tracking-tight text-transparent ">

      </motion.h1>
    </LampContainer>
  );
}
