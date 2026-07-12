import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent"
      />
    </div>
  );
}