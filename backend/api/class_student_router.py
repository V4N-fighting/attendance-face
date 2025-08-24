from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

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

class ClassStudentModel(BaseModel):
    class_id: int
    student_id: int

# GET all class-student relations
@router.get("/class_student")
def get_class_students():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM class_student")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return records

# POST: add student to class
@router.post("/class_student", status_code=status.HTTP_201_CREATED)
def add_class_student(rel: ClassStudentModel):
    class_id = rel.class_id
    student_id = rel.student_id
    if not class_id or not student_id:
        raise HTTPException(status_code=400, detail="Thiếu class_id hoặc student_id")
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO class_student (class_id, student_id) VALUES (%s, %s)",
            (class_id, student_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Thêm sinh viên vào lớp thành công",
                "class_id": class_id, "student_id": student_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT: update relation (rare)
@router.put("/class_student/{class_id}/{student_id}")
def update_class_student(class_id: int, student_id: int, rel: ClassStudentModel):
    new_class_id = rel.class_id
    new_student_id = rel.student_id
    if not new_class_id or not new_student_id:
        raise HTTPException(status_code=400, detail="Thiếu class_id hoặc student_id mới")
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE class_student SET class_id=%s, student_id=%s WHERE class_id=%s AND student_id=%s",
        (new_class_id, new_student_id, class_id, student_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {
        "message": "Cập nhật quan hệ thành công",
        "old_class_id": class_id,
        "old_student_id": student_id,
        "new_class_id": new_class_id,
        "new_student_id": new_student_id
    }

# DELETE: remove student from class
@router.delete("/class_student/{class_id}/{student_id}")
def delete_class_student(class_id: int, student_id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM class_student WHERE class_id=%s AND student_id=%s",
        (class_id, student_id)
    )
    conn.commit()
    rows = cursor.rowcount
    cursor.close()
    conn.close()
    if rows > 0:
        return {"message": "Xóa sinh viên khỏi lớp thành công",
                "class_id": class_id, "student_id": student_id}
    else:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi để xóa")

# GET: count students in a class
@router.get("/class_student_count/{class_id}")
def get_class_student_count(class_id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) AS count FROM class_student WHERE class_id=%s", (class_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    count = int(row["count"]) if row and "count" in row else 0
    return {"count": count}

# GET: students in a class
@router.get("/class_student/{class_id}/students")
def get_students_by_class(class_id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, student_code FROM students WHERE id IN (SELECT student_id FROM class_student WHERE class_id=%s)",
        (class_id,)
    )
    students = cursor.fetchall()
    cursor.close()
    conn.close()
    return students
