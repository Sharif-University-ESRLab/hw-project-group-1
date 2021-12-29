from threading import Thread, Condition, Lock
import time
import RPi.GPIO as GPIO
from mail import send_email, get_mail_values
from picamera import PiCamera
from time import sleep
from pathlib import Path
import os
import shutil
import datetime


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
        else:
            print("Sound Detected!")
        print(GPIO.input(self.sound))


    def run(self):
        # let us know when the pin goes HIGH or LOW
        GPIO.add_event_detect(self.sound, GPIO.BOTH, self.callback, bouncetime=300)
        # assign function to GPIO PIN, Run function on change
        GPIO.add_event_callback(self.sound, self.callback)
        ##detect events
        GPIO.event_detected(self.sound)
        while True:
            print(GPIO.event_detected(self.sound))
            time.sleep(1)
            if self.send and GPIO.event_detected(self.sound):
                print("HERE")
                send_email(*get_mail_values())
                self.send = False

def convert(path):
    pass

class VideoThread(Thread):
    def __init__(self, paused=False):
        super(VideoThread, self).__init__()
        self.paused = paused
        self.pause_cond = Condition(Lock())
        self.camera = PiCamera()
        self.camera.resolution = (640,480)

    def run(self):
        while True:
            with self.pause_cond:
                while self.paused:
                    self.pause_cond.wait()
                file_name = datetime.datetime.now()
                # self.camera.start_recording("videos/{}.h264".format(str(file_name)))
                # time.sleep(5)
                self.camera.capture("pictures/{}.jpg".format(str(file_name)))
                time.sleep(5)
                # self.camera.stop_recording()
            

    def pause(self):
        self.paused = True
        self.pause_cond.acquire()

    def resume(self):
        self.paused = False
        self.pause_cond.notify()
        self.pause_cond.release()


if __name__ == "__main__":
    sound_thread = AlarmThread()
    sound_thread.run()
