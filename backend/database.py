import os
import mysql.connector
from dotenv import load_dotenv
load_dotenv()
import pickle
from dataclasses import dataclass, field
from typing import List
from db import get_db_connection

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "")

@dataclass
class Student:
    code: str
    name: str
    encodings: List = field(default_factory=list)


def get_all_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    conn.close()

    for student in students:
        encodings_bytes = student["encodings"]
        if encodings_bytes is not None:   # ✅ check tránh None
            student["encodings"] = pickle.loads(encodings_bytes)
        else:
            student["encodings"] = None   # hoặc [] tuỳ bạn
    return students

