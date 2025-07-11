#!/bin/bash

# 1. Sicherstellen, dass Docker läuft
sudo systemctl start docker

# 2. MariaDB-Container starten (falls gestoppt)
# Ersetze "my-mariadb" durch den echten Namen deines Containers!
docker start my-mariadb

# 3. Visual Studio Code im Backend-Ordner öffnen
# Passe den Pfad an dein Backend-Projekt an!
code /home/pi/dein-backend-ordner

# 4. Backend starten (z.B. Node.js, Python, o.ä.)
cd /home/pi/dein-backend-ordner
npm start &

# 5. Warte 5 Sekunden, damit das Backend hochfahren kann
sleep 5

# 6. Browser öffnen