import json
def send_email(user, pwd, recipient, subject, body):
    import smtplib

    FROM = user
    TO = recipient if isinstance(recipient, list) else [recipient]
    SUBJECT = subject
    TEXT = body

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (FROM, ", ".join(TO), SUBJECT, TEXT)
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls()
    server.login(user, pwd)
    server.sendmail(FROM, TO, message)
    server.close()
    print('successfully sent the mail')

def get_mail_values():
    with open(".email.json", "r") as file:
        d = json.load(file)
        return d["username"], d["pass"], d["recipient"], "alert", "alert"
        
if __name__ == "__main__":
    send_email(*get_mail_values())