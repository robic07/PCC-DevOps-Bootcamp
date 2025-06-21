from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import os
import socket
import sqlalchemy
import logging
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('todo_app.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# /// = relative path, //// = absolute path
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://test:test@localhost/test'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DB_URL", "sqlite:///db.sqlite")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    complete = db.Column(db.Boolean)

@app.route("/")
def home():
    todo_list = Todo.query.all()
    container_id = socket.gethostname()
    h1_color = os.environ.get("H1_COLOR", "black")
    return render_template("base.html", todo_list=todo_list, h1_color=h1_color, container_id=container_id)


@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title")
    new_todo = Todo(title=title, complete=False)
    db.session.add(new_todo)
    db.session.commit()
    logger.info(f"Added new todo item: {title}")
    return redirect(url_for("home"))


@app.route("/update/<int:todo_id>")
def update(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    old_status = todo.complete
    todo.complete = not todo.complete
    db.session.commit()
    logger.info(f"Updated todo item (ID: {todo_id}) - Status changed from {old_status} to {todo.complete}")
    return redirect(url_for("home"))


@app.route("/delete/<int:todo_id>")
def delete(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    title = todo.title
    db.session.delete(todo)
    db.session.commit()
    logger.info(f"Deleted todo item (ID: {todo_id}, Title: {title})")
    return redirect(url_for("home"))

def create_tables():
    try:
        # Check if the table exists
        with app.app_context():
            inspector = sqlalchemy.inspect(db.engine)
            if not inspector.has_table("todo"):
                db.create_all()
                logger.info("Database tables created successfully")
            else:
                logger.info("Database tables already exist - skipping creation")
    except SQLAlchemyError as e:
        logger.error(f"Error during database initialization: {str(e)}")
        # Don't raise the error - let the application continue
        pass

if __name__ == "__main__":
    create_tables()  # Create tables before running the app
    app.run(debug=True)
else:
    create_tables()  # Create tables when running with gunicorn