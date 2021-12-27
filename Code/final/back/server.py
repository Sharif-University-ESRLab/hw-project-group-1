from flask import Flask

with open(".token") as file:
    global_token = file.readline()

alarm = 0


app = Flask(__name__)

@app.route("/")
def hello_world():
    pass

