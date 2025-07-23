#!/bin/bash

# 1. Sicherstellen, dass Docker läuft
if ! systemctl is-active --quiet docker; then
    echo "Docker läuft nicht. Starte Docker..."
    sudo systemctl start docker
else
    echo "Docker läuft bereits."
fi

# 2. Docker Compose starten (Container erstellen und starten)
echo "Starte Docker-Container mit docker-compose..."
docker compose up -d

# 3. Backend starten (Java Maven)
BACKEND_DIR="/home/casino/Casino_V21.07.2025/Casino/Documents/Module/Casino/casino-backend"

if [ -d "$BACKEND_DIR" ]; then
   cd "$BACKEND_DIR" || exit 1
   echo "Starte Backend mit Maven Wrapper..."
   ./mvnw spring-boot:run > backend.log 2>&1 &
   sleep 5  # Warte, damit Backend vollständig hochfährt
else
    echo "Backend-Verzeichnis existiert nicht: $BACKEND_DIR"
    exit 1
fi

# 4. Frontend starten (Vite-React-App)
FRONTEND_DIR="/home/casino/Casino_V21.07.2025/Casino/Documents/Module/Casino/casino-frontend"

if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR" || exit 1
    echo "Starte Frontend (Vite) mit npm..."
    npm run dev &
else
    echo "Frontend-Verzeichnis existiert nicht: $FRONTEND_DIR"
    exit 1
fi

# 5. Python-Skript starten
PYTHON_SCRIPT_DIR="/home/casino/Casino_V21.07.2025/Casino/Documents/Module/Casino/inputUmwandlung"
PYTHON_SCRIPT="main.py"

if [ -f "$PYTHON_SCRIPT_DIR/$PYTHON_SCRIPT" ]; then
    cd "$PYTHON_SCRIPT_DIR" || exit 1
    echo "Starte Python-Skript: $PYTHON_SCRIPT"
    python3 "$PYTHON_SCRIPT" &
else
    echo "Python-Skript nicht gefunden: $PYTHON_SCRIPT_DIR/$PYTHON_SCRIPT"
    exit 1
fi

# 6. Warte, damit Dienste hochfahren können
sleep 5

## 7. Frontend im Browser im Fullscreen öffnen (Kiosk-Modus für Raspberry Pi)
FRONTEND_URL="http://localhost:5173"

# Bildschirm-Aus verhindern und Mauszeiger ausblenden
xset s off          # Bildschirmschoner deaktivieren
xset -dpms          # Energiesparmodus deaktivieren
xset s noblank      # Bildschirm nicht schwarzschalten
unclutter -idle 0 & # Mauszeiger sofort ausblenden

if command -v chromium-browser > /dev/null; then
    echo "Starte Chromium im Kiosk-Modus..."
    pkill -f 'chromium-browser'  # Beende eventuell laufende Instanzen
    chromium-browser --noerrdialogs --disable-infobars --kiosk "$FRONTEND_URL" --user-data-dir=/tmp/kiosk-profile
elif command -v google-chrome > /dev/null; then
    echo "Starte Google Chrome im Kiosk-Modus..."
    pkill -f 'google-chrome'
    google-chrome --noerrdialogs --disable-infobars --kiosk "$FRONTEND_URL" --user-data-dir=/tmp/kiosk-profile
else
    echo "Kein unterstützter Browser gefunden. Öffne Standard-Browser..."
    xdg-open "$FRONTEND_URL"
fi
