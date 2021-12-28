from flask import Flask
import os
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
    for file in os.listdir("videos"):
        files["videos"].append(file)
    return files