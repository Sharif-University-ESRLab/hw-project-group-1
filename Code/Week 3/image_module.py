from picamera import PiCamera
from time import sleep

# camera initial settings
camera = PiCamera()
# for capturing images
camera.resolution = (2592, 1944)
# for recording videos
# camera.resolution = (1920, 1080)
# minimum 64 * 64

camera.framerate = 15
# initial value for brightness is 70 and can be changed to a number
# between 0 and 100
camera.brightness = 70

# The code below will show a preview for 5 seconds, with increasing
# the alpha value the output image will be see-through
camera.start_preview(alpha = 200)
sleep(5)
camera.capture('/home/pi/Desktop/image_normal.jpg')
# using the line below we'll be able to rotate the image
# other available values are 90,270 and 0 for normal display
camera.rotation = 90
sleep(5)
camera.capture('/home/pi/Desktop/image_90.jpg')
camera.rotation = 180
sleep(5)
camera.capture('/home/pi/Desktop/image_180.jpg')
camera.rotation = 270
sleep(5)
camera.capture('/home/pi/Desktop/image_270.jpg')
camera.rotation = 0
sleep(5)

camera.start_recording('/home/pi/Desktop/video.h264')
sleep(25)
camera.stop_recording()

# increasing brightness from 0 to 100
for i in range(100):
    camera.brightness = i
    sleep(0.1)
sleep(5)
camera.brightness = 50
camera.stop_preview()