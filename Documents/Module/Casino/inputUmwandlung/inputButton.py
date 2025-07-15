"""
from gpiozero import Button
from gpiozero import LED
from time import sleep
import pyautogui

button_1 = Button(4)
button_2 = Button(17)
button_3 = Button(14)
button_4 = Button(23)

joystick_1 = Button(6)
joystick_2 = Button(13)
joystick_3 = Button(19)
joystick_4 = Button(26)
joystick_5 = Button(24)
joystick_6 = Button(25)
joystick_7 = Button(8)
joystick_8 = Button(7)

led_1 = LED(2)
led_2 = LED(3)
led_3 = LED(18)
led_4 = LED(15)

led_1.on()
led_2.on()
led_3.on()
led_4.on()

def inputButton():
    if button_1.is_pressed:
        pyautogui.hotkey("Enter")
        sleep(0.15)

    if button_2.is_pressed:
        pyautogui.hotkey("Space")
        sleep(0.15)

    if button_3.is_pressed:
        pyautogui.hotkey("Enter")
        sleep(0.15)

    if button_4.is_pressed:
        pyautogui.hotkey("Enter")
        sleep(0.15)

    if joystick_1.is_pressed:
        pyautogui.hotkey("Right")
        sleep(0.15)

    if joystick_2.is_pressed:
        pyautogui.hotkey("Up")
        sleep(0.15)

    if joystick_3.is_pressed:
        pyautogui.hotkey("Left")
        sleep(0.15)

    if joystick_4.is_pressed:
        pyautogui.hotkey("Down")
        sleep(0.15)

    if joystick_5.is_pressed:
        pyautogui.hotkey("s")
        sleep(0.15)

    if joystick_6.is_pressed:
        pyautogui.press("d")
        sleep(0.15)

    if joystick_7.is_pressed:
        pyautogui.hotkey("w")
        sleep(0.15)

    if joystick_8.is_pressed:
        pyautogui.hotkey("a")
        sleep(0.15)
"""