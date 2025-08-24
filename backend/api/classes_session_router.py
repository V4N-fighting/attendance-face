from fastapi import APIRouter, HTTPException
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

class ClassSessionModel(BaseModel):
    id: Optional[int]
    class_id: Optional[int]
    session_date: Optional[str]
    # Tuỳ theo thiết kế bảng class_sessions có cột nào thì bổ sung

@router.get("/classes_session", response_model=List[ClassSessionModel])
def get_classes_session():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM class_sessions")
    classes_session = cursor.fetchall()
    cursor.close()
    conn.close()
    return classes_session
