from flask import Flask
from flask import request

with open(".token") as file:
    global_token = file.readline()

alarm = 0


app = Flask(__name__)

@app.route("/")
def hello_world():
    return "welcome to control panel"

@app.route("/login")
def login():
    return request.args.get("token")


