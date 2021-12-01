import RPi.GPIO as GPIO
import time

#GPIO SETUP
sound = 17
led = 27
#set pin modes
GPIO.setmode(GPIO.BCM)
#set channels as input and output
GPIO.setup(sound, GPIO.IN)
GPIO.setup(led,GPIO.OUT)
def callback(sound):
        if GPIO.input(sound):
            print("sound detected")
        	GPIO.output(led,HIGH)
	    else:
		    GPIO.output(led,LOW)

#detect when the pin goes HIGH or LOW
GPIO.add_event_detect(sound, GPIO.BOTH, bouncetime=300)
# assign function to GPIO PIN, Run function on change
GPIO.add_event_callback(sound, callback)

# infinite loop
while True:
        time.sleep(1)