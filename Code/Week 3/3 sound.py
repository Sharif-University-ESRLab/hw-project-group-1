import RPi.GPIO as GPIO
import time

MicPin = 17
##RelayPin = 3

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(MicPin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
##GPIO.setup(RelayPin, GPIO.OUT, initial=GPIO.LOW)

while True:
    print(GPIO.input(MicPin))
    time.sleep(1)