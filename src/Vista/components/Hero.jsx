import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <motion.h1
        className="text-[clamp(2rem,5vw,5rem)] font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Bienvenido a El Mundo del Condón
      </motion.h1>
      <motion.p
        className="mt-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Protege, disfruta y aprende.
      </motion.p>
    </section>
  );
}
