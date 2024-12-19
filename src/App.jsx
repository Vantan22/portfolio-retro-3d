import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import BookScene3D from "./components/BookScene3D";

// Sound effects
const soundEffects = {
  pageFlip: new Howl({
    src: ["/sounds/page-flip.mp3"],
    volume: 0.5,
  }),
  footsteps: new Howl({
    src: ["/sounds/footsteps.mp3"],
    volume: 0.3,
  }),
};

function App() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  const bookVariants = {
    closed: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    open: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const handleBookClick = () => {
    setIsBookOpen(!isBookOpen);
    soundEffects.pageFlip.play();
  };

  return (
    <div className="app">
      {/* Scene 3D container */}
      <BookScene3D />

      {/* Interactive book overlay */}
      {/* <motion.div
        className="book-overlay"
        variants={bookVariants}
        animate={isBookOpen ? "open" : "closed"}
        onClick={handleBookClick}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--book-pink)",
          padding: "20px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <h2>Click to open</h2>
        <AnimatePresence>
          {isBookOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="book-content"
            >
              <p>Book content goes here...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div> */}
    </div>
  );
}

export default App;
