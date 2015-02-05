import os
import upyun
from datetime import date
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)
app.config.from_pyfile(os.path.join(__DIR__, 'config.py'), silent=True)
uploader = upyun.UpYun(app.config['UPYUN_BUCKET'],
                       app.config['UPYUN_USERNAME'],
                       app.config['UPYUN_PASSWORD'],
                       timeout=30,
                       endpoint=upyun.ED_AUTO)

def generate_filename(image):
    ts = date.today().strftime('%y%m')
    filename = image.name
    return '%s/%s' % (ts, filename)

@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.files[0]
    filename = generate_filename(image)
    res = uploader.put(filename, image)

    return jsonify(error=False, message="http:/www.haha.com/1.jpg");