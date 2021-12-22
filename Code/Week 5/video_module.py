from picamera import PiCamera
from time import sleep
from pathlib import Path
import os

class Camera:
    def __init__(self, resolution, framerate, brightness = 70):
        self.base_url = '/home/pi/Desktop/camera_module'
        self.camera = PiCamera()
        self.camera.resolution = resolution
        self.camera.framerate = framerate
        self.camera.brightness = brightness
        self.video_counter = 1
        self.picture_counter = 1
        self.calc_video_capacity()

    def calc_video_capacity(self):
        self.video_capacity = 1

    def check_video_capacity(self):
        directory = f'{self.base_url}/videos/'
        path = Path(directory)
        num_recorded_videos = sum(1 for f in path.glob('*') if f.is_file())
        if num_recorded_videos > self.video_capacity:
            video_files = list(filter(lambda f: 'video' in f, os.listdir(directory)))
            video_files.sort()
            video_to_be_deleted = video_files[0]
            os.remove(f'{directory}{video_to_be_deleted}')

    def start(self):
        self.camera.start_preview(alpha = 200)

    def stop(self):
        self.camera.stop_preview()

    def capture_picture(self):
        self.camera.capture(f'{self.base_url}/pictures/image_{self.picture_counter}.jpg')
        self.picture_counter += 1

    def start_recording(self):
        self.check_video_capacity()
        self.camera.start_recording(f'{self.base_url}/videos/video{self.video_counter}.h264')
        self.video_counter += 1

    def stop_recording(self):
        self.camera.stop_recording()

runs = 0
camera = Camera(resolution=(64, 64), framerate=15)
camera.start()
while runs < camera.video_capacity:
    camera.start_recording()
    sleep(15)
    camera.capture_picture()
    sleep(15)
    camera.stop_recording()
    runs += 1
camera.stop()
