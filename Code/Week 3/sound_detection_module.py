import RPi.GPIO as GPIO
import time

#GPIO SETUP
sound = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(sound, GPIO.IN)
# GPIO.setup(led,GPIO.OUT)
def callback(sound):
    if GPIO.input(sound):
        print("Sound Detected!")
    	# GPIO.output(led,HIGH)
    else:
        print("NO!")
		# GPIO.output(led,LOW)

# let us know when the pin goes HIGH or LOW
GPIO.add_event_detect(sound, GPIO.BOTH, bouncetime=300)
# assign function to GPIO PIN, Run function on change
GPIO.add_event_callback(sound, callback)
# infinite loop
while True:
        time.sleep(1)