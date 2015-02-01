from flask import Flask, render_template, jsonify, request

app = Flask(__name__)
app.debug = True

@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    print request.files
    return jsonify(error=False, message="http:/www.haha.com/1.jpg");