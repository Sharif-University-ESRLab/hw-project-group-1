from threading import Thread, Condition, Lock
import time
import RPi.GPIO as GPIO
from mail import send_email, get_mail_values
from picamera import PiCamera
from time import sleep
from pathlib import Path
import os
import shutil


# class Camera:
#     def __init__(self, resolution, framerate, brightness=70, video_length=30):
#         self.base_url = '/home/pi/Desktop/camera_module'
#         self.camera = PiCamera()
#         self.camera.resolution = resolution
#         self.camera.framerate = framerate
#         self.camera.brightness = brightness
#         self.video_counter = 1
#         self.video_length = video_length
#         self.picture_counter = 1
#         self.video_capacity = self.calc_video_capacity()
#
#     def calc_video_capacity(self):
#         print(f"initializing video capacity calculation ...")
#         print("start recording dummy video for 5 seconds")
#         self.camera.start_recording(f'{self.base_url}/videos/dummy.h264')
#         sleep(2.5)
#         print("halfway there")
#         sleep(2.5)
#         self.camera.stop_recording()
#
#         video_size = os.path.getsize(f'{self.base_url}/videos/dummy.h264') * self.video_length / 5
#         total_free_size = self.free_disk_size()
#         print("removing dummy file")
#         os.remove(f'{self.base_url}/videos/dummy.h264')
#         print(
#             f"calculated -> possible video storage: {total_free_size / video_size} videos and {total_free_size / video_size * self.video_length} seconds")
#         return total_free_size / video_size, total_free_size / video_size * self.video_length
#         # returns count, total_time
#
#     def check_video_capacity(self):
#         directory = f'{self.base_url}/videos/'
#         path = Path(directory)
#         num_recorded_videos = sum(1 for f in path.glob('*') if f.is_file())
#         if num_recorded_videos > self.video_capacity:
#             video_files = list(filter(lambda f: 'video' in f, os.listdir(directory)))
#             video_files.sort()
#             video_to_be_deleted = video_files[0]
#             os.remove(f'{directory}{video_to_be_deleted}')
#
#     def start(self):
#         self.camera.start_preview(alpha=200)
#
#     def stop(self):
#         self.camera.stop_preview()
#
#     def capture_picture(self):
#         self.camera.capture(f'{self.base_url}/pictures/image_{self.picture_counter}.jpg')
#         self.picture_counter += 1
#
#     def start_recording(self):
#         self.check_video_capacity()
#         self.camera.start_recording(f'{self.base_url}/videos/video{self.video_counter}.h264')
#         self.video_counter += 1
#
#     def stop_recording(self):
#         self.camera.stop_recording()
#
#     def free_disk_size(self):
#         total, used, free = shutil.disk_usage("/")
#         print("Free: %d GiB" % (free // (2 ** 30)))


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
            if self.send:
                send_email(*get_mail_values())
                print(GPIO.event_detected(self.sound))
                self.send = False


# class VideoThread(Thread):
#     def __init__(self, paused=False):
#         super(VideoThread, self).__init__()
#         self.paused = paused
#         self.pause_cond = Condition(Lock())
#         runs = 0
#         camera = Camera(resolution=(64, 64), framerate=15)
#         camera.start()
#
#     def run(self):
#         while True:
#             with self.pause_cond:
#                 while self.paused:
#                     self.pause_cond.wait()
#                 print("doing sth")
#                 self.camera.start_recording()
#                 sleep(15)
#                 self.camera.capture_picture()
#                 sleep(15)
#                 self.camera.stop_recording()
#                 self.runs += 1
#             self.camera.stop()
#             time.sleep(2)
#
#     def pause(self):
#         self.paused = True
#         self.pause_cond.acquire()
#
#     def resume(self):
#         self.paused = False
#         self.pause_cond.notify()
#         self.pause_cond.release()

