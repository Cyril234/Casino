import React, { useEffect, useState } from "react";

import "../../styles/Slideshow.css";
import { useNavigate } from "react-router-dom";

const slides = [
  { id: 1, text: "Willkommen zur Slideshow!", link:'/register' },
  { id: 2, text: "Das ist die zweite Folie.", link:'/register' },
  { id: 3, text: "Und das ist die letzte Folie.", link:'/register' },
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
        {slides[current].text}
      </div>
    </div>
  );
}