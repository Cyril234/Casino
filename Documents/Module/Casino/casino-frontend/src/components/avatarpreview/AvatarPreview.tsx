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
    bottom: 0,
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
    const skin = skincolor?.toLowerCase() || "weiss";
    const eyes = eyecolor?.toLowerCase() || "blau";
    const hair = haircolor?.toLowerCase() || "braun";
    const hat = headgear?.toLowerCase() || "none";
    const top = shirt?.toLowerCase() || "weiss";
    const trousersType = trouserstype?.toLowerCase() || "lang";
    const trousersColor = trouserscolor?.toLowerCase() || "grau";
    const shoesType = shoes?.toLowerCase() || "sneakers";

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
                {/* Hautfarbe Kopf */}
                <img
                    src={`/avatars/base/skin_head/${skin}.png`}
                    alt="Skin Head"
                    style={{ ...layerStyle, zIndex: 1 }}
                />

                {/* Augen */}
                <img
                    src={`/avatars/eyes/${eyes}.png`}
                    alt="Eyes"
                    style={{ ...layerStyle, zIndex: 2 }}
                />

                {/* Bart, falls aktiviert */}
                {beard && (
                    <img
                        src="/avatars/beard/default.png"
                        alt="Beard"
                        style={{ ...layerStyle, zIndex: 3 }}
                    />
                )}

                {/* Haare */}
                <img
                    src={`/avatars/hair/${hair}.png`}
                    alt="Hair"
                    style={{ ...layerStyle, zIndex: 4 }}
                />

                {/* Kopfbedeckung */}
                {hat !== "none" && (
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

                {/* Beine sichtbar bei kurzen Hosen */}
                {trousersType === "kurz" && (
                    <img
                        src={`/avatars/base/skin_legs/${skin}.png`}
                        alt="Skin Legs"
                        style={{ ...layerStyle, zIndex: 8 }}
                    />
                )}

                {/* Hose */}
                <img
                    src={`/avatars/trousers/${trousersType}_${trousersColor}.png`}
                    alt="Trousers"
                    style={{ ...layerStyle, zIndex: 8 }}
                />

                {/* Schuhe oder Flipflops */}
                {shoesType === "flipflops" ? (
                    <img
                        src={`/avatars/shoes/flipflops_${skin}.png`}
                        alt="Flipflops"
                        style={{ ...layerStyle, zIndex: 7 }}
                    />
                ) : (
                    <img
                        src={`/avatars/shoes/${shoesType}.png`}
                        alt="Shoes"
                        style={{ ...layerStyle, zIndex: 9 }}
                    />
                )}
            </div>
        </div>
    );
}
