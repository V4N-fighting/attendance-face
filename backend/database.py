import os
import mysql.connector
from dotenv import load_dotenv
load_dotenv()
import pickle
from dataclasses import dataclass, field
from typing import List

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
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor()
    cursor.execute("SELECT student_code, name, encodings FROM students")
    all_students = cursor.fetchall()
    cursor.close()
    conn.close()
    students = []
    for code, hoten, encodings_bytes in all_students:
        encodings = pickle.loads(encodings_bytes)
        students.append(Student(str(code), str(hoten), encodings))
    return students
