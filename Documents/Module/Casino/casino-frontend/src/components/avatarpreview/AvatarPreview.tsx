import React from "react";

interface AvatarPreviewProps {
    skincolor: string;
    eyecolor: string;
    haircolor: string;
    headgear: string;
    shirt: string;
    trouserstype: string;
    trouserscolor: string;
    shoes: string;
    beard: boolean;
}

const layerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    imageRendering: "pixelated",
};

export default function AvatarPreview({
    skincolor,
    eyecolor,
    haircolor,
    headgear,
    shirt,
    trouserstype,
    trouserscolor,
    shoes,
    beard,
}: AvatarPreviewProps) {
    // Alle Werte in Kleinbuchstaben für sichere Pfade
    const skin = skincolor?.toLowerCase() || "weiss";
    const eyes = eyecolor?.toLowerCase() || "blau";
    const hair = haircolor?.toLowerCase() || "braun";
    const hat = headgear?.toLowerCase() || "";
    const top = shirt?.toLowerCase() || "weiss";
    const trousersType = trouserstype?.toLowerCase() || "kurz";
    const trousersColor = trouserscolor?.toLowerCase() || "grau";
    const shoesType = shoes?.toLowerCase() || "sneakers";

    // Hose: z. B. "kurz_pink.png" oder "lang_blau.png"
    const trousersFile = `${trousersType}_${trousersColor}.png`;

    // Schuhe mit Hautfarbe: z. B. "flipflops_weiss.png" oder "sneakers_braun.png"
    const shoesFile = `${shoesType}_${skin}.png`;

    return (
        <div
            className="avatar-preview-container"
            style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ width: "512px", height: "1800px", position: "relative" }}>
                {/* Haut (Kopf) */}
                <img
                    src={`/avatars/base/skin_head/${skin}.png`}
                    alt="Skin Head"
                    style={{
                        ...layerStyle,
                        zIndex: 1,
                        transform: "translate(-40px, -470px)", // X und Y korrigiert
                    }}
                />



                {/* Augen */}
                <img
                    src={`/avatars/eyes/${eyes}.png`}
                    alt="Eyes"
                    style={{ ...layerStyle, zIndex: 2, transform: "translate(70px, 75px)" }}

                />

                {/* Bart */}
                {beard && (
                    <img
                        src="/avatars/beard/default.png"
                        alt="Beard"
                        style={{ ...layerStyle, zIndex: 9, transform: "translate(-40px, -480px)" }}
                    />
                )}

                {/* Haare */}
                <img
                    src={`/avatars/hair/${hair}.png`}
                    alt="Hair"
                    style={{ ...layerStyle, zIndex: 4 }}
                />

                {/* Kopfbedeckung */}
                {hat && (
                    <img
                        src={`/avatars/headgear/${hat}.png`}
                        alt="Headgear"
                        style={{ ...layerStyle, zIndex: 5 }}
                    />
                )}

                {/* Shirt */}
                <img
                    src={`/avatars/shirt/${top}.png`}
                    alt="Shirt"
                    style={{ ...layerStyle, zIndex: 6 }}
                />

                {/* Schuhe mit Beinen/Füßen */}
                <img
                    src={`/avatars/shoes/${shoesFile}`}
                    alt="Shoes"
                    style={{ ...layerStyle, zIndex: 7 }}
                />

                {/* Hose */}
                <img
                    src={`/avatars/trousers/${trousersFile}`}
                    alt="Trousers"
                    style={{ ...layerStyle, zIndex: 8 }}
                />
            </div>
        </div>
    );
}
