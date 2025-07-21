import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react";
import "../styles/Leaderboard.css";
import { useNavigate } from "react-router-dom";

interface User {
  playerId: number;
  username: string;
  coins: number;
}

export default function Leaderboard() {
  const [posXPink, setPosXPink] = useState(-2000);
  const [posYPink, setPosYPink] = useState(-2000);
  const [posXOrange, setPosXOrange] = useState(2000);
  const [posYOrange, setPosYOrange] = useState(2000);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backBtnRef = useRef<HTMLButtonElement | null>(null);

  const navigate = useNavigate();

  // API-Logik: Lade User-Daten
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/players`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP Fehler: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.filter((user: User) => user.username !== "gast").sort((a: User, b: User) => b.coins - a.coins));
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter") {
        setLastKey(e.key);
      }
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => {
          if (prev === 0) return -1;
          if (prev === -1) return -1;
          return prev - 1;
        });
      }
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => {
          if (prev === -1) return 0;
          if (prev < users.length - 1) return prev + 1;
          return prev;
        });
      }
      if (e.key === "Enter") {
        if (selectedIndex === -1) {
          handleBackClick();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [users.length, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === -1) {
      backBtnRef.current?.focus();
    } else if (rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex]);

  const handleBackClick = () => {

  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankClass = (index: number) => {
    if (index === 0) return "leaderboard-gold";
    if (index === 1) return "leaderboard-silver";
    if (index === 2) return "leaderboard-bronze";
    return "leaderboard-default";
  };

  return (
    <div className="leaderboard-root">
      <div className="bg-blobs">
        <div className="blob orange-blob"></div>
        <div className="blob pink-blob"></div>
      </div>
      <div className="bg-lines"></div>
      <button
        onClick={() => (navigate("/gameoverview"))}
        className={`leaderboard-back-btn${selectedIndex === -1 ? " leaderboard-back-btn-selected" : ""}`}
        ref={backBtnRef}
        tabIndex={-1}
      >
        Zurück
      </button>
      <div className="leaderboard-content-wrapper">
        <div className="leaderboard-content">
          <div className="leaderboard-header">
            <h1 className="leaderboard-title">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Rangliste
            </h1>
            <p className="leaderboard-subtitle">Alle Spieler sortiert anhand von ihren Coins.</p>
          </div>
          <div className="leaderboard-list-wrapper">
            <div className="leaderboard-list">
              {users
                .sort((a, b) => b.coins - a.coins)
                .map((user, index) => (
                  <div
                    key={user.playerId}
                    ref={el => { rowRefs.current[index] = el; }}
                    className={`leaderboard-row ${getRankClass(index)}${selectedIndex === index ? " leaderboard-selected" : ""}`}
                  >
                    <div className="leaderboard-row-left">
                      <span className="leaderboard-rank">{index + 1}</span>
                      {getRankIcon(index)}
                      <span className="leaderboard-username">{user.username}</span>
                    </div>
                    <div className="leaderboard-row-right">
                      <span className="leaderboard-coins">{user.coins.toLocaleString()}</span>
                      <span className="leaderboard-coins-label">Coins</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="leaderboard-footer">
            <div className="leaderboard-footer-stats">
              <div className="leaderboard-footer-stat">
                <div className="leaderboard-footer-value">{users.length}</div>
                <div>Anzahl Spieler</div>
              </div>
              <div className="leaderboard-footer-stat">
                <div className="leaderboard-footer-value">
                  {users.reduce((sum, user) => sum + user.coins, 0).toLocaleString()}
                </div>
                <div>Coins gesamt</div>
              </div>
              <div className="leaderboard-footer-stat">
                <div className="leaderboard-footer-value">
                  {users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.coins, 0) / users.length).toLocaleString() : 0}
                </div>
                <div>Durchschnittliche Coins pro Spieler</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
