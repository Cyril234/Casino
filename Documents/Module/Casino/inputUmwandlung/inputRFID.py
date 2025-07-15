from smartcard.System import readers # pip install pyscard
import pyautogui
from smartcard.Exceptions import NoCardException

# Alle angeschlossenen Reader auflisten
reader_list = readers()

def inputRFID():
    for reader in reader_list:
        try:
            verbindung = reader.createConnection()
            verbindung.connect()

            get_uid_befehl = [0xFF, 0xCA, 0x00, 0x00, 0x00]
            daten, sw1, sw2 = verbindung.transmit(get_uid_befehl)

            # Prüfen, ob die Übertragung erfolgreich war
            if sw1 == 0x90 and sw2 == 0x00:
                # UID als Hex ausgeben
                uid = "".join(f"{b:02X}" for b in daten)
                pyautogui.write(uid)
            else:
                print("Fehler beim Auslesen der Karte!")

        except Exception as e:
            pass




