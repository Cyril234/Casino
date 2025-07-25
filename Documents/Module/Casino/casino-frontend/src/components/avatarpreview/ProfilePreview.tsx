import React from "react";
import "../../styles/Gameoverview.css";

interface ProfilePreviewProps {
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

export default function ProfilePreview({
    skincolor,
    eyecolor,
    haircolor,
    headgear,
    shirt,
    trouserstype,
    trouserscolor,
    shoes,
    beard,
}: ProfilePreviewProps) {

    const skin = skincolor?.toLowerCase() || "weiss";
    const eyes = eyecolor?.toLowerCase() || "blau";
    const hair = haircolor?.toLowerCase() || "braun";
    const hat = headgear?.toLowerCase() || "";
    const top = shirt?.toLowerCase() || "weiss";
    const trousersType = trouserstype?.toLowerCase() || "kurz";
    const trousersColor = trouserscolor?.toLowerCase() || "grau";
    const shoesType = shoes?.toLowerCase() || "sneakers";

    const trousersFile = `${trousersType}_${trousersColor}.png`;
    const shoesFile = `${shoesType}_${skin}.png`;

    return (
        <div className="profile-picture">
            <div
                style={{
                    width: "512px",
                    height: "1800px",
                    position: "fixed",
                    transform: "scale(0.06) translateY(400px) translateX(25px)",
                    transformOrigin: "center"
                }}
            >
                <img
                    src={`/avatars/base/skin_head/${skin}.png`}
                    alt="Skin Head"
                    style={{
                        ...layerStyle,
                        zIndex: 1,
                        transform: "translate(-40px, -470px)",
                    }}
                />

                <img
                    src={`/avatars/eyes/${eyes}.png`}
                    alt="Eyes"
                    style={{ ...layerStyle, zIndex: 2, transform: "translate(70px, 75px)" }}
                />

                {beard && (
                    <img
                        src="/avatars/beard/default.png"
                        alt="Beard"
                        style={{ ...layerStyle, zIndex: 9, transform: "translate(-40px, -480px)" }}
                    />
                )}

                <img
                    src={`/avatars/hair/${hair}.png`}
                    alt="Hair"
                    style={{ ...layerStyle, zIndex: 4 }}
                />

                {hat && (
                    <img
                        src={`/avatars/headgear/${hat}.png`}
                        alt="Headgear"
                        style={{ ...layerStyle, zIndex: 5 }}
                    />
                )}

                <img
                    src={`/avatars/shirt/${top}.png`}
                    alt="Shirt"
                    style={{ ...layerStyle, zIndex: 6 }}
                />

                <img
                    src={`/avatars/shoes/${shoesFile}`}
                    alt="Shoes"
                    style={{ ...layerStyle, zIndex: 7 }}
                />

                <img
                    src={`/avatars/trousers/${trousersFile}`}
                    alt="Trousers"
                    style={{ ...layerStyle, zIndex: 8 }}
                />
            </div>
        </div>
    );
}
