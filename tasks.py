from invoke import run, task

@task
def server():
    run("cd site && dev_server.py")