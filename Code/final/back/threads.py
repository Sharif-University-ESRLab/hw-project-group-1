from threading import Thread, Condition, Lock
import time
from mail import send_email, get_mail_values
class AlarmThread(Thread):
    def __init__(self):
        super(AlarmThread, self).__init__()
        self.send = False

    def run(self):
        while True:
            if self.send:
                send_email(*get_mail_values())
                self.send = False


class VideoThread(Thread):
    def __init__(self, paused = False):
        super(VideoThread, self).__init__()
        self.paused = paused
        self.pause_cond = Condition(Lock())

    def run(self):
        while True:
            with self.pause_cond:
                while self.paused:
                    self.pause_cond.wait()
                print("doing sth")
            time.sleep(2)

    def pause(self):
        self.paused = True
        self.pause_cond.acquire()

    def resume(self):
        self.paused = False
        self.pause_cond.notify()
        self.pause_cond.release()
