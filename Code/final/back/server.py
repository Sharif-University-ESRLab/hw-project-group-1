from flask import Flask
from flask import request

with open(".token") as file:
    global_token = file.readline()

alarm = 0
recording = 0

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "welcome to control panel"

@app.route("/start_recording")
def start_recording():
    if request.args.get("token") != global_token:
        return "invalid token"

    return "temp"

@app.route("/stop_recording")
def stop_recording():
    if request.args.get("token") != global_token:
        return "invalid token"
        
    return "temp"

@app.route("/status")
def get_status():
    if request.args.get("token") != global_token:
        return "invalid token"
