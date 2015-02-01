from flask import Flask, render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def hello():
    return render_template('index.html')
