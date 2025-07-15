import { useEffect, useState } from "react";
import "../styles/Gameoverview.css"
import Slideshow from "./GameOverview/Slideshow";

export default function Gameoverview() {
  const [lastKey, setLastKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.key); // Debug
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        console.log(e.key);
        setLastKey(e.key);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Callback für das Child, um den Key zurückzusetzen
  const handleKeyUsed = () => setLastKey(null);

  return (
    <div className="gameoverview diagonal-grid">
        <div className="bg-blobs">
            <div className="blob orange-blob"></div>
            <div className="blob pink-blob"></div>
        </div>
        <div className="bg-lines"></div>
        <div className="content">
            <Slideshow input={lastKey} onKeyUsed={handleKeyUsed} />
        </div>
    </div>
  );
}
