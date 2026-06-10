import React from "react";
import { motion } from "framer-motion";

const Reveal = ({ children, delay = 0, y = 24, className = "", ...props }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
