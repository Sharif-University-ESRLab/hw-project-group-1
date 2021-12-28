# Sound3a.py
# Sound Sensor Module KY-038
# Using GPIO events

import RPi.GPIO as GPIO
import time

P_SOUND = 22 # adapt to your wiring
P_LED = 24 # adapt to your wiring

def setup():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(P_LED, GPIO.OUT)
    GPIO.output(P_LED, GPIO.LOW)
    GPIO.setup(P_SOUND, GPIO.IN)
    GPIO.add_event_detect(P_SOUND, GPIO.BOTH, onButtonEvent)

def onButtonEvent(channel):
    global isOn
    if GPIO.input(P_SOUND) == GPIO.HIGH:
        isOn = not isOn
        if isOn:
            GPIO.output(P_LED, GPIO.HIGH)
        else:
            GPIO.output(P_LED, GPIO.LOW)
        # Have to wait a while
        # because event is triggered several times (like button bouncing)    
        time.sleep(0.5) 
       
setup()
isOn = False
while True:
    time.sleep(0.1)
