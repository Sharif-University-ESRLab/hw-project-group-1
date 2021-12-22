from picamera import PiCamera
from time import sleep

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
        self.video_capacity = 10

    def start(self):
        self.camera.start_preview(alpha = 200)

    def stop(self):
        self.camera.stop_preview()

    def capture_picture(self):
        self.camera.capture('{self.base_url}/pictures/image_{self.picture_counter}.jpg')
        self.picture_counter += 1

    def start_recording(self):
        self.camera.start_recording('{self.base_url}/videdos/video{self.video_counter}.h264')
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
