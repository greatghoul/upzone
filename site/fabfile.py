from fabric.decorators import task
from main import app

@task
def server():
    """Start development server"""
    app.run(host="0.0.0.0", port=8080)
