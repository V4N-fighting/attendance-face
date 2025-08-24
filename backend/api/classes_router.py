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

class ClassModel(BaseModel):
    id: Optional[int] = None
    name: str
    teacher: Optional[str] = None

class ClassCreate(BaseModel):
    name: str
    teacher: Optional[str] = None

@router.get("/classes", response_model=List[ClassModel])
def get_classes():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM classes")
    classes = cursor.fetchall()
    cursor.close()
    conn.close()
    return classes

@router.post("/classes", response_model=ClassModel, status_code=status.HTTP_201_CREATED)
def add_class(class_in: ClassCreate):
    if not class_in.name:
        raise HTTPException(status_code=400, detail="Thiếu tên lớp")
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO classes (name, teacher) VALUES (%s, %s)", (class_in.name, class_in.teacher))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return ClassModel(id=new_id, name=class_in.name, teacher=class_in.teacher)

@router.put("/classes/{id}", response_model=ClassModel)
def update_class(id: int, class_in: ClassCreate):
    if not class_in.name:
        raise HTTPException(status_code=400, detail="Thiếu tên lớp")
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()
    cursor.execute("UPDATE classes SET name=%s, teacher=%s WHERE id=%s", (class_in.name, class_in.teacher, id))
    conn.commit()
    cursor.close()
    conn.close()
    return ClassModel(id=id, name=class_in.name, teacher=class_in.teacher)

@router.delete("/classes/{id}")
def delete_class(id: int):
    try:
        conn = get_db_connection()
        if conn is None:
            raise HTTPException(status_code=500, detail="Không thể kết nối DB")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM classes WHERE id=%s", (id,))
        conn.commit()
        rows = cursor.rowcount
        cursor.close()
        conn.close()
        if rows > 0:
            return {"message": "Xóa lớp thành công", "id": id}
        else:
            raise HTTPException(status_code=404, detail="Không tìm thấy lớp")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
