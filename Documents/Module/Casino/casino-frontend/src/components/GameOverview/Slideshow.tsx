import React, { useEffect, useState } from "react";
import "../../styles/Slideshow.css";
import { useNavigate } from "react-router-dom";
import sounds from "../litleThings/Sounds";

const slides = [
  { id: 1, img: "./public/titelbilder/blackjackTitelbild.png", link: '/gameoverview/blackjack' },
  { id: 2, img: "./public/titelbilder/horseRacingTitelbild.png", link: '/gameoverview/horserace' },
  { id: 3, img: "./public/titelbilder/minenfeldTitelbild.png", link: '/gameoverview/mines' },
  { id: 4, img: "./public/titelbilder/pokerTitelbild.png", link: '/' },
  { id: 5, img: "./public/titelbilder/rouletteTitelbild.png", link: '/gameoverview/roulette' },
  { id: 6, img: "./public/titelbilder/slotMachineTitelbild.png", link: '/gameoverview/slot' },
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
      sounds.stop("kasinoMusik.mp3");
      sounds.play("klickSchlecht.mp3", false);
      navigate(slides[current].link);
      onKeyUsed();
    }
  }, [input, current]);

  const prevIndex = (current - 1 + slides.length) % slides.length;
  const nextIndex = (current + 1) % slides.length;

  return (
    <div className="slideshow-wrapper">
      <div className="slide preview prev">
        <img src={slides[prevIndex].img} alt="Preview Left" />
      </div>
      <div className="slide main">
        <img src={slides[current].img} alt="Current Slide" />
      </div>
      <div className="slide preview next">
        <img src={slides[nextIndex].img} alt="Preview Right" />
      </div>
    </div>
  );
}
