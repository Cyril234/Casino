import React, { useEffect, useState } from "react";

import "../../styles/Slideshow.css";
import { useNavigate } from "react-router-dom";

const slides = [
  { id: 1, img: "/blackjackTitelbild.png", link:'/' },
  { id: 2, img: "/rouletteTitelbild.png", link:'/' },
  { id: 3, img: "/horseRacingTitelbild.png", link:'/' },
  { id: 4, img: "/slotMachineTitelbild.png", link:'/' },
];

interface SlideshowProps {
  input: string | null;
  onKeyUsed: () => void;
}

export default function Slideshow({ input, onKeyUsed }: SlideshowProps) {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (input === "ArrowLeft") {
            setCurrent(prev => (prev - 1 + slides.length) % slides.length);
            onKeyUsed();
        } else if (input === "ArrowRight") {
            setCurrent(prev => (prev + 1) % slides.length);
            onKeyUsed();
        }
    }, [input]);

    useEffect(() => {
        if (input === "Enter") {
            navigate(slides[current].link);
            onKeyUsed();
        }
    }, [input, current]);

  return (
    <div className="slide">
      <div className="slide-content">
        <img 
          src={slides[current].img} 
          alt="Testbild"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}