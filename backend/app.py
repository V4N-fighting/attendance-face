from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Lỗi kết nối MySQL: {err}")
        return None

from api.students import students_bp
from api.students_count import students_count_bp
from api.classes import classes_bp
from api.classes_count import classes_count_bp
from api.classes_session import classes_session_bp
from api.classes_session_count import classes_session_count_bp

app.register_blueprint(students_bp)
app.register_blueprint(students_count_bp)
app.register_blueprint(classes_bp)
app.register_blueprint(classes_count_bp)
app.register_blueprint(classes_session_bp)
app.register_blueprint(classes_session_count_bp)

if __name__ == "__main__":
    app.run(debug=True)
