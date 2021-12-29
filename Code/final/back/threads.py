from threading import Thread, Condition, Lock
import time
import RPi.GPIO as GPIO
from mail import send_email, get_mail_values
from picamera import PiCamera
from time import sleep
from pathlib import Path
import os
import shutil


class AlarmThread(Thread):
    def __init__(self):
        super(AlarmThread, self).__init__()
        self.send = False
        # GPIO SETUP
        self.sound = 17
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.sound, GPIO.IN)

    def callback(self):
        if GPIO.input(self.sound):
            print("Sound Detected!")
            self.send = True
        else:
            print("Sound Detected!")
            self.send = True
        print(GPIO.input(self.sound))

    def run(self):
        while True:
            # let us know when the pin goes HIGH or LOW
            GPIO.add_event_detect(self.sound, GPIO.BOTH, self.callback, bouncetime=300)
            # assign function to GPIO PIN, Run function on change
            GPIO.add_event_callback(self.sound, self.callback)
            ##detect events
            GPIO.event_detected(self.sound)
            print(GPIO.event_detected(self.sound))
            if self.send and GPIO.event_detected(self.sound):
                send_email(*get_mail_values())
                self.send = False


