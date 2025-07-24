
from gpiozero import Button
from gpiozero import LED
from time import sleep
import pyautogui

button_1 = Button(4)
button_2 = Button(17)
button_right_green = Button(14)
button_right_yellow = Button(23)

joystick_right_right = Button(6)
joystick_right_up = Button(13)
joystick_right_left = Button(19)
joystick_right_down = Button(26)
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
        pyautogui.press("tab")
        sleep(0.15)

    if button_2.is_pressed:
        pyautogui.press("space")
        sleep(0.15)

    if button_right_green.is_pressed:
        pyautogui.press("esc")
        sleep(0.15)

    if button_right_yellow.is_pressed:
        pyautogui.press("enter")
        sleep(0.15)

    if joystick_right_right.is_pressed:
        pyautogui.press("right")
        sleep(0.15)

    if joystick_right_up.is_pressed:
        pyautogui.press("up")
        sleep(0.15)

    if joystick_right_left.is_pressed:
        pyautogui.press("left")
        sleep(0.15)

    if joystick_right_down.is_pressed:
        pyautogui.press("down")
        sleep(0.15)

    if joystick_5.is_pressed or joystick_6.is_pressed or joystick_7.is_pressed or joystick_8.is_pressed:
        pyautogui.press("tab")
        sleep(0.15)

