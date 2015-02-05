import os
import datetime

from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template

import upyun
from shortid import ShortId

app = Flask(__name__)
app.debug = True

instance_path = os.path.dirname(__file__)
config_file = os.path.join(instance_path, 'config.py')
app.config.from_pyfile(config_file, silent=True)

short_id = ShortId()
uploader = upyun.UpYun(app.config['UPYUN_BUCKET'],
                       app.config['UPYUN_USERNAME'],
                       app.config['UPYUN_PASSWORD'],
                       timeout=30,
                       endpoint=upyun.ED_AUTO)

def generate_filename(image):
    folder_name = datetime.date.today().strftime('%y%m')
    file_ext    = image.mimetype.lower().replace('image/', '')
    file_name   = '%s.%s' % (short_id.generate(), file_ext)
    return '%s/%s' % (folder_name, file_name)

@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.files.get('image', None)

    if image:
        filename = generate_filename(image)
        result = uploader.put(filename, image.read())

        if result:
            url = 'http://%s/%s' % (app.config['UPYUN_DOMAIN'], filename)
            return jsonify(success=True, url=url)
        
    return jsonify(success=False)