import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)

while True:
    if GPIO.input(17)== GPIO.HIGH:
        print('Noisy')
        print(GPIO.input(17))
    if GPIO.input(17)==GPIO.LOW:
        print('Quiet')
    time.sleep(1)