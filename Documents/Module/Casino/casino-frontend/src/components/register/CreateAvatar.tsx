import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import AvatarPreview from "../avatarpreview/AvatarPreview";
import "../../styles/Avatar.css";
import sounds from "../litleThings/Sounds";
import VirtualKeyboard from "../../Keyboard/Virtual_Keyboard"; 

interface PlayerDto {
  id: number;
  username: string;
  email: string;
}

export default function CreateAvatar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { player } = (location.state || {}) as { player?: PlayerDto };
  const token = sessionStorage.getItem("authToken");

  const [avatarName, setAvatarName] = useState("");
  const [avatarDescription, setAvatarDescription] = useState("");

  const [haircolorOptions, setHaircolorOptions] = useState<string[]>([]);
  const [skincolorOptions, setSkincolorOptions] = useState<string[]>([]);
  const [eyecolorOptions, setEyecolorOptions] = useState<string[]>([]);
  const [headgearOptions, setHeadgearOptions] = useState<string[]>([]);
  const [shirtOptions, setShirtOptions] = useState<string[]>([]);
  const [trouserstypeOptions, setTrouserstypeOptions] = useState<string[]>([]);
  const [trouserscolorOptions, setTrouserscolorOptions] = useState<string[]>([]);
  const [shoesOptions, setShoesOptions] = useState<string[]>([]);

  const [haircolorIdx, setHaircolorIdx] = useState(0);
  const [skincolorIdx, setSkincolorIdx] = useState(0);
  const [eyecolorIdx, setEyecolorIdx] = useState(0);
  const [headgearIdx, setHeadgearIdx] = useState(0);
  const [shirtIdx, setShirtIdx] = useState(0);
  const [trouserstypeIdx, setTrouserstypeIdx] = useState(0);
  const [trouserscolorIdx, setTrouserscolorIdx] = useState(0);
  const [shoesIdx, setShoesIdx] = useState(0);
  const [beard, setBeard] = useState(false);

  const [playerId, setPlayerId] = useState<number | null>(null);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedField, setFocusedField] = useState<"name" | "description" | null>(null);

  useEffect(() => {
    if (!player || !token) navigate("/", { replace: true });
  }, [player, token, navigate]);

  useEffect(() => {
    fetchEnum("haircolor", setHaircolorOptions);
    fetchEnum("skincolor", setSkincolorOptions);
    fetchEnum("eyecolor", setEyecolorOptions);
    fetchEnum("headgear", setHeadgearOptions);
    fetchEnum("shirt", setShirtOptions);
    fetchEnum("trouserstype", setTrouserstypeOptions);
    fetchEnum("trouserscolor", setTrouserscolorOptions);
    fetchEnum("shoes", setShoesOptions);

    sounds.stop("casinomusic.mp3");
    sounds.stop("blackjackmusic.wav");
    sounds.stop("horseracemusic.wav");
    sounds.stop("minesmusic.wav");
    sounds.stop("roulettemusic.wav");
    sounds.stop("slotmusic.wav");
  }, []);

  useEffect(() => {
    const fetchPlayerId = async () => {
      if (!token) return;
      try {
        const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();
        setPlayerId(data.playerId);
      } catch (err) {
        console.error("Fehler bei dem Bekommen der SpielerId:", err);
      }
    };
    fetchPlayerId();
  }, [token]);

  const fetchEnum = async (key: string, setter: (arr: string[]) => void) => {
    try {
      const res = await fetch(`http://localhost:8080/api/enums/${key}`, {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
      setter(await res.json());
    } catch (err) {
      console.error(`Fehler beim Laden von ${key}:`, err);
    }
  };

  const enumsLoaded =
    haircolorOptions.length &&
    skincolorOptions.length &&
    eyecolorOptions.length &&
    headgearOptions.length &&
    shirtOptions.length &&
    trouserstypeOptions.length &&
    trouserscolorOptions.length &&
    shoesOptions.length;

  const cycle = (cur: number, max: number, dir: 1 | -1) => (cur + dir + max) % max;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player || !token || !enumsLoaded) return;

    const avatarPayload = {
      name: avatarName,
      description: avatarDescription,
      player: { playerId },
      haircolor: haircolorOptions[haircolorIdx],
      skincolor: skincolorOptions[skincolorIdx],
      beard,
      eyecolor: eyecolorOptions[eyecolorIdx],
      headgear: headgearOptions[headgearIdx],
      shirt: shirtOptions[shirtIdx],
      trouserstype: trouserstypeOptions[trouserstypeIdx],
      trouserscolor: trouserscolorOptions[trouserscolorIdx],
      shoes: shoesOptions[shoesIdx]
    };

    try {
      const res = await fetch("http://localhost:8080/api/avatars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(avatarPayload)
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      navigate("/gameoverview");
    } catch (err) {
      console.error(err);
      alert("Avatar konnte nicht erstellt werden.");
    }
  };

  const cancel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/players/${playerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res) console.log("Fehler beim Abbrechen!");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const onFocusField = (field: "name" | "description") => {
    setFocusedField(field);
    setShowKeyboard(true);
  };

  const onBlurField = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !["avatar-name", "avatar-description"].includes(active.id)) {
        setFocusedField(null);
        setShowKeyboard(false);
      }
    }, 100);
  };

  const onKeyPress = (key: string) => {
    if (focusedField === "name") {
      setAvatarName(prev => prev + key);
    } else if (focusedField === "description") {
      setAvatarDescription(prev => prev + key);
    }
  };

  const onBackspace = () => {
    if (focusedField === "name") {
      setAvatarName(prev => prev.slice(0, -1));
    } else if (focusedField === "description") {
      setAvatarDescription(prev => prev.slice(0, -1));
    }
  };

  const ArrowSelector = ({ label, options, index, setIndex, id }: {
    label: string;
    options: string[];
    index: number;
    setIndex: (i: number) => void;
    id: string;
  }) => (
    <div className="arrow-selector" id={id}>
      <span className="form-label">{label}</span>
      <button type="button" className="arrow-btn" onClick={() => setIndex(cycle(index, options.length, -1))} disabled={!options.length}><MdArrowBack /></button>
      <span className="value-display">{options.length ? options[index] : "Lade..."}</span>
      <button type="button" className="arrow-btn" onClick={() => setIndex(cycle(index, options.length, 1))} disabled={!options.length}><MdArrowForward /></button>
    </div>
  );

  return (
    <main className="create-avatar-page">
      <h1 className="create-avatar-title">Konfiguriere deinen Avatar!</h1>
      <div className="create-avatar-wrapper" style={{ display: "flex", justifyContent: "center", gap: "2rem", maxWidth: "1000px", margin: "auto" }}>
        <form className="create-avatar-form" onSubmit={handleSubmit} style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label className="form-label" htmlFor="avatar-name">Avatar-Name</label>
          <input
            id="avatar-name"
            className="form-input"
            value={avatarName}
            onChange={e => setAvatarName(e.target.value)}
            onFocus={() => onFocusField("name")}
            onBlur={onBlurField}
            required
          />

          <label className="form-label" htmlFor="avatar-description">Beschreibung</label>
          <input
            id="avatar-description"
            className="form-input"
            value={avatarDescription}
            onChange={e => setAvatarDescription(e.target.value)}
            onFocus={() => onFocusField("description")}
            onBlur={onBlurField}
            required
          />

          <ArrowSelector id="haircolor-select" label="Haarfarbe" options={haircolorOptions} index={haircolorIdx} setIndex={setHaircolorIdx} />
          <ArrowSelector id="skincolor-select" label="Hautfarbe" options={skincolorOptions} index={skincolorIdx} setIndex={setSkincolorIdx} />
          <ArrowSelector id="eyecolor-select" label="Augenfarbe" options={eyecolorOptions} index={eyecolorIdx} setIndex={setEyecolorIdx} />
        </form>

        <div className="avatar-preview-container" style={{ flex: "0 0 30%", display: "flex", justifyContent: "center" }}>
          <AvatarPreview
            skincolor={skincolorOptions[skincolorIdx]}
            eyecolor={eyecolorOptions[eyecolorIdx]}
            haircolor={haircolorOptions[haircolorIdx]}
            headgear={headgearOptions[headgearIdx]}
            shirt={shirtOptions[shirtIdx]}
            trouserstype={trouserstypeOptions[trouserstypeIdx]}
            trouserscolor={trouserscolorOptions[trouserscolorIdx]}
            shoes={shoesOptions[shoesIdx]}
            beard={beard}
          />
        </div>

        <form className="create-avatar-form" onSubmit={handleSubmit} style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <ArrowSelector id="headgear-select" label="Kopfbedeckung" options={headgearOptions} index={headgearIdx} setIndex={setHeadgearIdx} />
          <ArrowSelector id="shirt-select" label="Oberteil" options={shirtOptions} index={shirtIdx} setIndex={setShirtIdx} />
          <ArrowSelector id="trouserstype-select" label="Hosenart" options={trouserstypeOptions} index={trouserstypeIdx} setIndex={setTrouserstypeIdx} />
          <ArrowSelector id="trouserscolor-select" label="Hosenfarbe" options={trouserscolorOptions} index={trouserscolorIdx} setIndex={setTrouserscolorIdx} />
          <ArrowSelector id="shoes-select" label="Schuhe" options={shoesOptions} index={shoesIdx} setIndex={setShoesIdx} />

          <div className="beard-toggle" style={{ marginTop: "1rem" }}>
            <label className="form-label" htmlFor="beard-checkbox">Bart</label>
            <input id="beard-checkbox" type="checkbox" checked={beard} onChange={e => setBeard(e.target.checked)} />
          </div>

          <button className="submit-btn" type="submit" disabled={!enumsLoaded} style={{ marginTop: "2rem" }}>Registrieren</button>
          <button className="submit-btn" onClick={cancel} disabled={!enumsLoaded} style={{ marginTop: "2rem" }}>Abbrechen</button>
        </form>
      </div>

      {showKeyboard && (
        <VirtualKeyboard
          onKeyPress={onKeyPress}
          onBackspace={onBackspace}
          onClose={() => {
            setShowKeyboard(false);
            setFocusedField(null);
          }}
        />
      )}
    </main>
  );
}
