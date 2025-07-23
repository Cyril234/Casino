import { useEffect, useRef, useState } from "react";

export function useBadgeScanner(onScan: (scan: string) => void) {
    const inputBuffer = useRef("");
    const timeoutRef = useRef<number | null>(null);
    const [badgenumber, setBadgenumber] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                console.error("Kein Token im Session Storage gefunden.");
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/players/byToken/${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error(`Fehler beim Laden der Spielerinformationen: ${res.status} - ${errorText}`);
                    return;
                }

                const player = await res.json();
                setPlayerId(player.id);
                setBadgenumber(player.badgenumber);
            } catch (err) {
                console.error("Netzwerkfehler beim Laden des Spielers:", err);
            }
        };

        fetchPlayerInfo();
    }, []); 

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                inputBuffer.current += e.key;
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                timeoutRef.current = window.setTimeout(async () => {
                    const scannedInput = inputBuffer.current;
                    inputBuffer.current = "";

                    const match = scannedInput.match(/UID:(.*?);/);
                    if (match && playerId !== null) {
                        const uid = match[1];
                        const token = sessionStorage.getItem("authToken");

                        if (!token) {
                            console.error("Kein Token im Session Storage gefunden.");
                            return;
                        }

                        try {
                            const res = await fetch(`http://localhost:8080/api/players/badge/${playerId}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify({ badgenumber: uid })
                            });

                            if (!res.ok) {
                                const errorText = await res.text();
                                console.error(`Fehler beim Aktualisieren der Badge: ${res.status} - ${errorText}`);
                            } else {
                                setBadgenumber(uid);
                                console.log("Badge erfolgreich aktualisiert.");
                            }
                        } catch (err) {
                            console.error("Netzwerkfehler beim Aktualisieren der Badge:", err);
                        }
                    }

                    onScan(scannedInput);
                }, 300);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [playerId, onScan]);
}
