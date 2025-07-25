import React, { useEffect, useState } from "react";
import "../styles/KeyboardNumber.css";

type VirtualKeyboardProps = {
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onClose: () => void;
};

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const totalKeys = keys.length + 2; 

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
    onKeyPress,
    onBackspace,
    onClose,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                setSelectedIndex(i => (i + 1) % totalKeys);
                e.preventDefault();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                setSelectedIndex(i => (i - 1 + totalKeys) % totalKeys);
                e.preventDefault();
            } else if (e.key === "Enter") {
                if (selectedIndex < keys.length) {
                    onKeyPress(keys[selectedIndex]);
                } else if (selectedIndex === keys.length) {
                    onBackspace();
                } else {
                    onClose();
                }
                e.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, onKeyPress, onBackspace, onClose]);

    return (
        <div className="virtual-keyboardNumber">
            <div className="keyboardNumber-keys">
                {keys.map((key, index) => (
                    <button
                        key={key}
                        className={`keyboardNumber-key ${index === selectedIndex ? "active-key" : ""}`}
                        onClick={() => onKeyPress(key)}
                        type="button"
                    >
                        {key}
                    </button>
                ))}
                <button
                    type="button"
                    className={`keyboardNumber-key keyboardNumber-backspace ${selectedIndex === keys.length ? "active-key" : ""}`}
                    onClick={onBackspace}
                >
                    ⌫
                </button>
                <button
                    type="button"
                    className={`keyboardNumber-key keyboardNumber-close ${selectedIndex === keys.length + 1 ? "active-key" : ""}`}
                    onClick={onClose}
                >
                    ✖
                </button>
            </div>
        </div>
    );
};

export default VirtualKeyboard;
