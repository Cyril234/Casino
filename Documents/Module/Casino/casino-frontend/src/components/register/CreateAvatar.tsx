import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

interface PlayerDto {
    id: number;
    username: string;
    email: string;
}

export default function CreateAvatar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { player } = (location.state || {}) as { player?: PlayerDto; };
    const token = sessionStorage.getItem("authToken");
    useEffect(() => {
        if (!player || !token) navigate("/", { replace: true });
    }, [player, token, navigate]);

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

    useEffect(() => {
        fetchEnum("haircolor", setHaircolorOptions);
        fetchEnum("skincolor", setSkincolorOptions);
        fetchEnum("eyecolor", setEyecolorOptions);
        fetchEnum("headgear", setHeadgearOptions);
        fetchEnum("shirt", setShirtOptions);
        fetchEnum("trouserstype", setTrouserstypeOptions);
        fetchEnum("trouserscolor", setTrouserscolorOptions);
        fetchEnum("shoes", setShoesOptions);
    }, []);

    useEffect(() => {
        const fetchPlayerId = async () => {
            if (!token) {
                console.error("Kein Auth-Token gefunden.");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP Fehler: ${res.status}`);
                }

                const data = await res.json();
                setPlayerId(data.playerId);
                console.log(data.playerId)
            } catch (err) {
                console.error("Fehler bei dem Bekommen der SpielerId:", err);
            }
        };

        fetchPlayerId();
    }, [token]);

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
            player: {
                playerId: playerId
            },
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
                console.error("Avatar-POST fehlgeschlagen:", msg);
                throw new Error(msg);
            }

            navigate("/gameoverview");
        } catch (err) {
            console.log(avatarPayload)
            console.error(err);
            alert("Avatar konnte nicht erstellt werden.");
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
            <button type="button" className="arrow-btn prev-btn" onClick={() => setIndex(cycle(index, options.length, -1))} disabled={!options.length}>
                <MdArrowBack />
            </button>
            <span className="value-display">{options.length ? options[index] : "Lade..."}</span>
            <button type="button" className="arrow-btn next-btn" onClick={() => setIndex(cycle(index, options.length, 1))} disabled={!options.length}>
                <MdArrowForward />
            </button>
        </div>
    );

    return (
        <main className="create-avatar-page">
            <h1 className="create-avatar-title">Konfiguriere deinen Avatar!</h1>
            <form className="create-avatar-form" onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="avatar-name">Avatar-Name</label>
                <input id="avatar-name" className="form-input" value={avatarName} onChange={e => setAvatarName(e.target.value)} required />
                <label className="form-label" htmlFor="avatar-description">Beschreibung</label>
                <input id="avatar-description" className="form-input" value={avatarDescription} onChange={e => setAvatarDescription(e.target.value)} required />
                <ArrowSelector id="haircolor-select" label="Haarfarbe" options={haircolorOptions} index={haircolorIdx} setIndex={setHaircolorIdx} />
                <ArrowSelector id="skincolor-select" label="Hautfarbe" options={skincolorOptions} index={skincolorIdx} setIndex={setSkincolorIdx} />
                <ArrowSelector id="eyecolor-select" label="Augenfarbe" options={eyecolorOptions} index={eyecolorIdx} setIndex={setEyecolorIdx} />
                <ArrowSelector id="headgear-select" label="Kopfbedeckung" options={headgearOptions} index={headgearIdx} setIndex={setHeadgearIdx} />
                <ArrowSelector id="shirt-select" label="Oberteil" options={shirtOptions} index={shirtIdx} setIndex={setShirtIdx} />
                <ArrowSelector id="trouserstype-select" label="Hosenart" options={trouserstypeOptions} index={trouserstypeIdx} setIndex={setTrouserstypeIdx} />
                <ArrowSelector id="trouserscolor-select" label="Hosenfarbe" options={trouserscolorOptions} index={trouserscolorIdx} setIndex={setTrouserscolorIdx} />
                <ArrowSelector id="shoes-select" label="Schuhe" options={shoesOptions} index={shoesIdx} setIndex={setShoesIdx} />
                <div className="beard-toggle">
                    <label className="form-label" htmlFor="beard-checkbox">Bart</label>
                    <input id="beard-checkbox" type="checkbox" checked={beard} onChange={e => setBeard(e.target.checked)} />
                </div>
                <button className="submit-btn" type="submit" disabled={!enumsLoaded}>Registrieren</button>
            </form>
        </main>
    );
}
