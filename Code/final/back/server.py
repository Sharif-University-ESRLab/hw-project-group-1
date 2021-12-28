from flask import Flask
import os
from flask import request
from threads import AlarmThread, VideoThread

with open(".token") as file:
    global_token = file.readline()

alarm = 0
recording = 0
started = 0
thread = VideoThread(True)
thread.setDaemon(True)
thread_sound = AlarmThread()
thread_sound.setDaemon(True)
thread_sound.start()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "welcome to control panel"

@app.route("/start_recording")
def start_recording():
    global started
    if request.args.get("token") != global_token:
        return "invalid token"
    if started == 0:
        thread.paused = False
        thread.start()
        started = 1
    elif started == 1:
        if thread.paused:
            thread.resume()

    return "temp"

@app.route("/stop_recording")
def stop_recording():
    if request.args.get("token") != global_token:
        return "invalid token"
    if not thread.paused:
        thread.pause()
    return "temp"

@app.route("/status")
def get_status():
    if request.args.get("token") != global_token:
        return "invalid token"

    return {
        "alarm":alarm,
        "recording":recording,
    }

@app.route("/delete_file/<name>")
def delete_file(name):
    if request.args.get("token") != global_token:
        return "invalid token"
    try:
        os.remove(f"videos/{name}")
    except Exception as ignore:
        pass
    try:
        os.remove(f"pictures/{name}")
    except Exception as ignore:
        pass
    return "removed file succesfully"

@app.route("/get_files")
def get_file_list():
    if request.args.get("token") != global_token:
        return "invalid token"
    files = {
        "pictures":[],
        "videos":[]
    }
    for file in os.listdir("pictures"):
        files["pictures"].append(file)
    return files

@app.route("/download")
def download_file():
    pass
    # TODO fill this function

@app.route("/set_alarm_off")
def set_alarm_off():
    if request.args.get("token") != global_token:
        return "invalid token"
    thread_sound.send = False
    return "turned alarm off successfully"

@app.route("/reset_alarm")
def reset_alarm():
    if request.args.get("token") != global_token:
        return "invalid token"
    thread_sound.send = True
    return "reset alarm, looking for noise"