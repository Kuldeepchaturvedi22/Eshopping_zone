// components/AnimatedToast.jsx
import { motion, AnimatePresence } from "framer-motion";

const toastVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

export default function AnimatedToast({ message, type, show }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed top-5 right-5 px-6 py-3 rounded-lg text-white shadow-lg z-50 ${bgColor}`}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
