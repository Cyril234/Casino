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
BACKEND_DIR="/home/casino/Casino/Documents/Module/Casino/casino-backend"

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR" || exit 1
    echo "Starte Backend mit Maven Wrapper..."
    ./mvnw spring-boot:run &
else
    echo "Backend-Verzeichnis existiert nicht: $BACKEND_DIR"
    exit 1
fi

# 4. Warte 5 Sekunden, damit das Backend hochfahren kann
sleep 5

# 5. Browser öffnen für Backend-Seite (NICHT phpMyAdmin)
WEBPAGE="http://localhost:8080"

if command -v google-chrome > /dev/null; then
    echo "Starte Browser im Fullscreen-Modus..."
    google-chrome --start-fullscreen "$WEBPAGE"
else
    echo "Google Chrome ist nicht installiert. Öffne Standard-Browser..."
    xdg-open "$WEBPAGE"
fi