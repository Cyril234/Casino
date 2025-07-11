#!/bin/bash

# 1. Sicherstellen, dass Docker läuft
sudo systemctl start docker

# 2. MariaDB-Container starten (falls gestoppt)
# Ersetze "mariadb-casino-v1" durch den tatsächlichen Namen deines Containers, falls anders!
docker start mariadb-casino-v1

# 3. Backend starten (z.B. Node.js, Python, o.ä.)
# Passe den Pfad an dein Backend-Projekt an!
cd /home/pi/dein-backend-ordner
npm start &

# 4. Warte 5 Sekunden, damit das Backend hochfahren kann
sleep 5

# 5. Browser öffnen
chromium-browser http://localhost:8080 &