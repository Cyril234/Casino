import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Gameoverview.css";
import Slideshow from "./GameOverview/Slideshow";

export default function Gameoverview() {
  const [lastKey, setLastKey] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        setLastKey(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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
