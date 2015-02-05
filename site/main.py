import os
import datetime

from functools import wraps

from flask import Flask
from flask import session
from flask import request
from flask import Response
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

def uploader():
    return upyun.UpYun(app.config['UPYUN_BUCKET'],
                       session['username'],
                       session['password'],
                       timeout=30,
                       endpoint=upyun.ED_AUTO)

def generate_filename(image):
    folder_name = datetime.date.today().strftime('%y%m')
    file_ext    = image.mimetype.lower().replace('image/', '')
    file_name   = '%s.%s' % (short_id.generate(), file_ext)
    return '%s/%s' % (folder_name, file_name)

def check_auth(username, password):
    session['username'] = username
    session['password'] = password

    try:
      uploader().usage()
      return True
    except Exception as e:
      print '%s: %s' % (e.msg, e.err)
      return False

def authenticate():
    message = 'Please login your operator.'
    headers = {'WWW-Authenticate': 'Basic realm="%s"' % message}
    return Response(message, 401, headers)

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

@app.route('/', methods=['GET'])
@requires_auth
def hello():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
@requires_auth
def upload():
    image = request.files.get('image', None)

    if image:
        filename = generate_filename(image)
        result = uploader().put(filename, image.read())

        if result:
            url = 'http://%s/%s' % (app.config['UPYUN_DOMAIN'], filename)
            return jsonify(success=True, url=url)
        
    return jsonify(success=False)