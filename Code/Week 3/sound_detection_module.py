import RPi.GPIO as GPIO
import time

#GPIO SETUP
sound = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(sound, GPIO.IN)

def callback(sound):
    if GPIO.input(sound):
        print("Sound Detected!")
    else:
        print("Sound Detected!")
    print(GPIO.input(sound))


# let us know when the pin goes HIGH or LOW
GPIO.add_event_detect(sound, GPIO.BOTH,callback, bouncetime=300)
# assign function to GPIO PIN, Run function on change
GPIO.add_event_callback(sound, callback)
##detect events
GPIO.event_detected(sound)

# infinite loop
while True:
    print(GPIO.event_detected(sound))
    time.sleep(1)
    
    