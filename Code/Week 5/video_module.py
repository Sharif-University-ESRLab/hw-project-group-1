from picamera import PiCamera
from time import sleep


def config_camera(camera):
    # camera.resolution = (1920, 1080)
    # minimum 64 * 64
    camera.resolution = (64, 64)
    camera.framerate = 15
    # between 0 and 100
    camera.brightness = 70

def init_camera(camera):
    camera.start_preview(alpha = 200)

def stop_camera(camera):
    camera.stop_preview()

picture_counter = 1
def capture_picture(camera):
    camera.capture('/home/pi/Desktop/video_module/pictures/image_{picture_counter}.jpg')
    picture_counter += 1

video_counter = 1
def start_recording(camera):
    camera.start_recording('/home/pi/Desktop/video_module/video{video_counter}.h264')
    video_counter += 1

def stop_recording(camera):
    camera.stop_recording()

max_capacity = 10
runs = 0

camera = PiCamera()
config_camera(camera)
init_camera(camera)
while runs < max_capacity:
    start_recording(camera)
    sleep(15)
    capture_picture(camera)
    sleep(15)
    stop_recording(camera)
    runs += 1
stop_camera(camera)
