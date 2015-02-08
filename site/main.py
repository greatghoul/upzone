# coding: utf-8

import os
import datetime

from functools import wraps

from flask import Flask
from flask import session
from flask import request
from flask import Response
from flask import jsonify
from flask import render_template

from tags import js_tag
from tags import css_tag

from upyun import UpYun
from shortid import ShortId

app = Flask(__name__)
app.debug = True

instance_path = os.path.dirname(__file__)
config_file = os.path.join(instance_path, 'config.py')
app.config.from_pyfile(config_file, silent=True)

short_id = ShortId()

def uploader(auth):
    return UpYun(app.config['UPYUN_BUCKET'], auth.username, auth.password)
                  
def generate_filename(image):
    folder_name = datetime.date.today().strftime('%y%m')
    file_ext    = image.mimetype.lower().replace('image/', '')
    file_name   = '%s.%s' % (short_id.generate(), file_ext)
    return '%s/%s' % (folder_name, file_name)

def check_auth(auth):
    try:
      uploader(auth).usage()
      return True
    except Exception as e:
      print "Error: %s" % e
      return False

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization

        if auth and check_auth(auth):
            return f(*args, **kwargs)
        else:
            message = 'Please login your operator.'
            headers = {'WWW-Authenticate': 'Basic realm="%s"' % message}
            return Response(message, 401, headers)

    return decorated

@app.route('/', methods=['GET'])
@requires_auth
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
@requires_auth
def upload():
    image = request.files.get('image', None)

    if image:
        filename = generate_filename(image)
        result = uploader(request.authorization).put(filename, image.read())

        if result:
            url = 'http://%s/%s' % (app.config['UPYUN_DOMAIN'], filename)
            return jsonify(success=True, message=url)
        
    return jsonify(success=False, message=u"上传失败")