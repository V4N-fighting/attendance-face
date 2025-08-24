from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel
import json
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Pydantic models
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

class Student(BaseModel):
    id: Optional[int] = None
    name: str
    student_code: str
    image_urls: Optional[dict] = {}
    created_at: Optional[str] = None

class StudentCreate(BaseModel):
    name: str
    student_code: str

# GET all students
@router.get("/students", response_model=List[Student])
def get_students():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, student_code, image_urls, created_at FROM students")
    students = cursor.fetchall()
    cursor.close()
    conn.close()

    from datetime import datetime
    for stu in students:
        # Xử lý trường hợp image_urls là None: chuyển thành {}
        if stu.get("image_urls") is None:
            stu["image_urls"] = {}
        elif isinstance(stu["image_urls"], str):
            try:
                stu["image_urls"] = json.loads(stu["image_urls"])
            except Exception:
                stu["image_urls"] = {}
        if "created_at" in stu and isinstance(stu["created_at"], datetime):
            stu["created_at"] = stu["created_at"].isoformat()
    return students

# POST student
@router.post("/students", response_model=Student, status_code=status.HTTP_201_CREATED)
def add_student(student: StudentCreate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO students (name, student_code) VALUES (%s, %s)",
        (student.name, student.student_code)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return Student(id=new_id, name=student.name, student_code=student.student_code)

# PUT student
@router.put("/students/{id}", response_model=Student)
def update_student(id: int, student: StudentCreate):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE students SET name=%s, student_code=%s WHERE id=%s",
        (student.name, student.student_code, id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return Student(id=id, name=student.name, student_code=student.student_code)

# DELETE student
@router.delete("/students/{id}", status_code=200)
def delete_student(id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM class_student WHERE student_id=%s", (id,))
        cursor.execute("DELETE FROM students WHERE id=%s", (id,))
        conn.commit()
        rows = cursor.rowcount
        cursor.close()
        conn.close()
        if rows > 0:
            return {"message": "Đã xóa sinh viên và quan hệ liên quan", "id": id}
        else:
            raise HTTPException(status_code=404, detail="Không tìm thấy sinh viên để xóa")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
