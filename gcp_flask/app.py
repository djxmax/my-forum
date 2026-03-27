from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({
        'name': 'MyForum Flask API',
        'version': '1.0.0',
        'status': 'running',
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
    })

@app.route('/hello/<name>')
def hello(name):
    return jsonify({
        'message': f'Hello {name} depuis GCP Cloud Run !',
        'timestamp': datetime.utcnow().isoformat(),
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)