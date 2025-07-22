import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Gameoverview.css";
import Slideshow from "../GameOverview/Slideshow";
import { MdLogout, MdSettings } from "react-icons/md";
import { FaTrophy, FaUser } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";

export default function Gameoverview() {
  const [posXPink, setPosXPink] = useState(-2000);
  const [posYPink, setPosYPink] = useState(-2000);
  const [posXOrange, setPosXOrange] = useState(2000);
  const [posYOrange, setPosYOrange] = useState(2000);
  const [username, setUsername] = useState<String>("");
  const [volume, setVolume] = useState(0);
  const [soundstatus, setSoundstatus] = useState(false);
  const [coins, setCoins] = useState<Number>(0);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();
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
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            Accept: "*/*",
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error(`HTTP Fehler: ${response.status}`);

        const data = await response.json();
        setUsername(data.username);
        setCoins(data.coins);
        setVolume(data.volume);
        setSoundstatus(data.soundstatus);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:8080/api/players/byToken/${token}`)
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden des Users");
        return res.json();
      })
      .then(data => {
        setCoins(data.coins);
        setUsername(data.username);
      })
      .catch(err => {
        setCoins(0);
        setUsername("");
        console.error(err);
      });
  }, []);

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
        } else if (e.key === "Escape") {
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

  return (
    <div className="gameoverview diagonal-grid">
      <div className="bg-blobs-game">
        <div className="blob orange-blob-game"></div>
        <div className="blob pink-blob-game"></div>
      </div>
      <div className="bg-lines-game"></div>
      <img src="public/pokergeld.png" alt="Testbild" width="100" height="100" className="pokergeld" />
      <h1 className="cointext">{coins !== null ? coins.toString() : ''}</h1>

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
