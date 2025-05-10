## The Python Todo Sample Application using MySQL/SQLite

The app is a simple CRUD (Create, read, update, delete) Todo application made with Python Flask.

## How to run?

### Python version

- Python 3.8.10

## Common setup

Create a python virtual environment first:

To create a virtual environment in Windows:

- Set venv using this command: `python -m venv venv`
- Make sure running script is enabled on your shell by running this command on your Powershell with admin rights. `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Activate the virtual environment: `. .\venv\Scripts\Activate.ps1`

To create a virtual environment in other OS:

- Set venv using this command: `python3 -m venv venv`
- Activate the virtual environment: `source venv/bin/activate`

Install the packages by running this command

```bash
pip install -r requirements.txt
```

Run the application

```bash
flask run
```

App should be accessible here: [http://localhost:5000](http://localhost:5000).

You can also run the application using gunicorn:

```bash
gunicorn --bind 0.0.0.0:5001 server:app
```

> NOTE: Before running the application make sure that you have a MySQL VM or container running locally if you are testing MySQL as the database
