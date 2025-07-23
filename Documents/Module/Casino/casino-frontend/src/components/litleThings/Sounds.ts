type SoundEntry = {
  audio: HTMLAudioElement;
  isLooping: boolean;
};

const sounds = (() => {
  const sounds = new Map<string, SoundEntry>();

  return {
    async play(filename: string, loop: boolean = false, baseVolume: number = 1): Promise<void> {
      filename = "../../../public/sounds/" + filename;

      // Verhindere doppeltes Abspielen
      if (sounds.has(filename)) {
        const entry = sounds.get(filename);
        if (!entry?.audio.ended && !entry?.audio.paused) {
          console.log(`Sound ${filename} läuft bereits.`);
          return;
        }
      }

      const currentToken = sessionStorage.getItem("authToken");
      if (!currentToken) {
        console.warn("Kein Auth-Token gefunden.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/players/byToken/${currentToken}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${currentToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error(`HTTP Fehler: ${res.status}`);
        const data = await res.json();

        console.log(data);

        const volume = baseVolume * (data.volume/100); // 👈 Lautstärke-Kombination

        const audio = new Audio(filename);
        audio.volume = volume;
        audio.loop = loop;

        await audio.play();
        console.log(`Spiele ${filename} (loop: ${loop}) mit Lautstärke ${volume} (base: ${baseVolume}, user: ${data.volume/100})`);

        if (loop) {
          sounds.set(filename, { audio, isLooping: true });
        }
      } catch (err) {
        console.error("Fehler beim Abspielen des Sounds:", err);
      }
    },

    stop(filename: string): void {
      filename = "../../../public/sounds/"+filename;
      const entry = sounds.get(filename);
      if (!entry) {
        console.warn(`Kein laufender Sound mit dem Namen ${filename} gefunden.`);
        return;
      }

      entry.audio.pause();
      entry.audio.currentTime = 0;
      sounds.delete(filename);
      console.log(`Sound ${filename} gestoppt.`);
    }
  };
})();

export default sounds;