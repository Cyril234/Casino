import React, { useEffect, useState } from "react";
import "../styles/Keyboard.css";

type VirtualKeyboardProps = {
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onClose: () => void;
};

const keys = [
    "Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Y", "X", "C", "V", "B", "N", "M", "@"
];

const COLUMNS = 10;

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
    onKeyPress,
    onBackspace,
    onClose,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLowerCase, setIsLowerCase] = useState(false);
    const totalKeys = keys.length + 3;
    
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
                    const key = isLowerCase ? keys[selectedIndex].toLowerCase() : keys[selectedIndex];
                    onKeyPress(key);
                } else if (selectedIndex === keys.length) {
                    setIsLowerCase(prev => !prev);
                } else if (selectedIndex === keys.length + 1) {
                    onBackspace();
                } else {
                    onClose();
                }
                e.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, onKeyPress, onBackspace, onClose, totalKeys, isLowerCase]);

    return (
        <div className="virtual-keyboard">
            <div className="keyboard-keys">
                {keys.map((key, index) => {
                    const displayKey = isLowerCase ? key.toLowerCase() : key;
                    return (
                        <button
                            key={key}
                            className={`keyboard-key ${index === selectedIndex ? "active-key" : ""}`}
                            onClick={() => onKeyPress(displayKey)}
                            type="button"
                        >
                            {displayKey}
                        </button>
                    );
                })}
                <button
                    type="button"
                    className={`keyboard-key keyboard-shift ${selectedIndex === keys.length ? "active-key" : ""} ${isLowerCase ? "shift-active" : ""}`}
                    onClick={() => setIsLowerCase(prev => !prev)}
                >
                    ⇧
                </button>
                <button
                    type="button"
                    className={`keyboard-key keyboard-backspace ${selectedIndex === keys.length + 1 ? "active-key" : ""}`}
                    onClick={onBackspace}
                >
                    ⌫
                </button>
                <button
                    type="button"
                    className={`keyboard-key keyboard-close ${selectedIndex === keys.length + 2 ? "active-key" : ""}`}
                    onClick={onClose}
                >
                    ✖
                </button>
            </div>
        </div>
    );
};

export default VirtualKeyboard;
