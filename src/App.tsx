import React, { useEffect } from "react";
import "./App.css";
import HeroHeader from "./components/HeroHeader";
import Grow from "./components/Grow";
import Baseball from "./components/Baseball";
import LittleThings from "./components/LittleThings";

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    // Scroll to the top on component mount
    window.scrollTo(0, 0);

    // Attach the event listener to ensure it scrolls to the top before unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="relative App">
      <HeroHeader />
      <Grow />
      <Baseball />
      <LittleThings />
    </div>
  );
}

export default App;
