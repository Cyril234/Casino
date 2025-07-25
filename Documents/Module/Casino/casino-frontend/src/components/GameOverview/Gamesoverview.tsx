import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Gameoverview.css";
import Slideshow from "../GameOverview/Slideshow";
import { MdLogout, MdSettings } from "react-icons/md";
import { FaTrophy, FaUser } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import sounds from "../litleThings/Sounds";
import ProfilePreview from "../avatarpreview/ProfilePreview";

export default function Gameoverview() {
  const [posXPink, setPosXPink] = useState(-2000);
  const [posYPink, setPosYPink] = useState(-2000);
  const [posXOrange, setPosXOrange] = useState(2000);
  const [posYOrange, setPosYOrange] = useState(2000);
  const [username, setUsername] = useState<String>("");
  const [currentPlayerId, setCurrentPlayerId] = useState();
  const [volume, setVolume] = useState(0);
  const [soundstatus, setSoundstatus] = useState(false);
  const [coins, setCoins] = useState<Number>(0);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [haircolor, setHaircolor] = useState<string>("");
  const [skincolor, setSkincolor] = useState<string>("");
  const [beard, setBeard] = useState<boolean>(false);
  const [eyecolor, setEyecolor] = useState<string>("");
  const [headgear, setHeadgear] = useState<string>("");
  const [shirt, setShirt] = useState<string>("");
  const [trouserstype, setTrouserstype] = useState<string>("");
  const [trouserscolor, setTrouserscolor] = useState<string>("");
  const [shoes, setShoes] = useState<string>("");


  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("authToken");

  const dropdownItems = [
    { label: "Abmelden", action: () => navigate("/logout"), icon: <MdLogout /> },
    { label: "Einstellungen", action: () => navigate("/settings"), icon: <MdSettings /> },
    { label: "Rangliste", action: () => navigate("/leaderboard"), icon: <FaTrophy /> },
    { label: "Profil", action: () => navigate("/edit-profile"), icon: <FaUser />, disabled: username === "gast" },
    { label: "Letzte Spiele", action: () => navigate("/gaminghistory"), icon: <GiConsoleController />, disabled: username === "gast" },
  ];

  useEffect(() => {
    if (open && buttonRefs.current[selectedIndex]) {
      buttonRefs.current[selectedIndex]?.focus();
    }
  }, [selectedIndex, open]);

  useEffect(() => {
    buttonRefs.current = dropdownItems.map((_, i) => buttonRefs.current[i] ?? null);
  }, [dropdownItems.length]);

  useEffect(() => {
    if (!token) return;
    sounds.stop("blackjackmusic.wav");
    sounds.stop("horseracemusic.wav");
    sounds.stop("minesmusic.wav");
    sounds.stop("roulettemusic.wav");
    sounds.stop("slotmusic.wav");
    const fetchAndHandleSound = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();

        setUsername(data.username);
        setCurrentPlayerId(data.playerId);
        setCoins(data.coins);
        setVolume(data.volume);
        setSoundstatus(data.soundstatus === "ON");

      } catch (err) {
        console.error("Fehler beim Laden der Benutzerdaten:", err);
      }
    };

    fetchAndHandleSound();
  }, [token, location.key]);

  useEffect(() => {
    if (!token) return;

    const handleSound = async () => {
      if (soundstatus && volume > 0) {
        await sounds.play("casinomusic.mp3", true, 0.6);
      } else {
        sounds.stop("casinomusic.mp3");
      }
    };

    handleSound();
  }, [soundstatus, volume, token]);


  useEffect(() => {
    if (!currentPlayerId || !token) return;

    const fetchAvatar = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/avatars/byPlayer/${currentPlayerId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();

        setHaircolor(data.haircolor);
        setSkincolor(data.skincolor);
        setBeard(data.beard);
        setEyecolor(data.eyecolor);
        setHeadgear(data.headgear);
        setShirt(data.shirt);
        setTrouserstype(data.trouserstype);
        setTrouserscolor(data.trouserscolor);
        setShoes(data.shoes);
      } catch (err) {
        console.error("Fehler beim Laden des Avatars:", err);
      }
    };

    fetchAvatar();
  }, [currentPlayerId, token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosXPink(prev => {
        if (prev < -400) return prev + Math.floor(Math.random() * 6);
        if (prev > 2320) return prev - Math.floor(Math.random() * 6);
        return prev + Math.floor(Math.random() * 11) - 5;
      });

      setPosYPink(prev => {
        if (posXPink < -400) return prev + Math.floor(Math.random() * 6);
        if (posXPink > 1480) return prev - Math.floor(Math.random() * 6);
        return prev + Math.floor(Math.random() * 11) - 5;
      });

      setPosXOrange(prev => {
        if (posXPink < -400) return prev + Math.floor(Math.random() * 6);
        if (posXPink > 2320) return prev - Math.floor(Math.random() * 6);
        return prev + Math.floor(Math.random() * 11) - 5;
      });

      setPosYOrange(prev => {
        if (posXPink < -400) return prev + Math.floor(Math.random() * 6);
        if (posXPink > 1480) return prev - Math.floor(Math.random() * 6);
        return prev + Math.floor(Math.random() * 11) - 5;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [posXPink]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % dropdownItems.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + dropdownItems.length) % dropdownItems.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const item = dropdownItems[selectedIndex];
          if (!item.disabled) {
            item.action();
            setOpen(false);
          }
        } else if (e.key === "Tab") {
          e.preventDefault();
          setOpen(false);
        }
      } else {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setSelectedIndex(0);
        } else if (["ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
          setLastKey(e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, dropdownItems]);

  const handleKeyUsed = () => setLastKey(null);

  return (
    <div className="gameoverview diagonal-grid">
      <div className="bg-blobs-game">
        <div className="blob orange-blob-game"></div>
        <div className="blob pink-blob-game"></div>
      </div>
      <div className="bg-lines-game"></div>
      <img src="public/pokergeld.png" alt="Testbild" width="100" height="100" className="pokergeld" />
      <h1 className="cointext">{coins !== null ? coins.toString() : ''}</h1>

      <div>
        <ProfilePreview
          skincolor={skincolor}
          eyecolor={eyecolor}
          haircolor={haircolor}
          headgear={headgear}
          shirt={shirt}
          trouserstype={trouserstype}
          trouserscolor={trouserscolor}
          shoes={shoes}
          beard={beard}
        />
      </div>

      <div className="dropdown">
        <div
          className="dropdown-summary"
          onClick={() => setOpen(!open)}
        >
          {username}
        </div>

        {open && (
          <ul className="dropdown-menu">
            {dropdownItems.map((item, index) => (
              <li key={item.label}>
                <button
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  onClick={() => {
                    if (!item.disabled) {
                      item.action();
                      setOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={selectedIndex === index ? "focused" : ""}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="content">
        <Slideshow input={lastKey} onKeyUsed={handleKeyUsed} />
      </div>
    </div>
  );
}
