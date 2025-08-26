from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import mysql.connector
import os
from dotenv import load_dotenv
from db import get_db_connection
from datetime import datetime

load_dotenv()

router = APIRouter()

class ClassSessionModel(BaseModel):
    id: Optional[int]
    class_id: Optional[int]
    topic: Optional[str]
    start_time: Optional[datetime]   # đúng kiểu
    end_time: Optional[datetime]
    room: Optional[str]


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


@router.get("/classes_session/{class_id}", response_model=List[ClassSessionModel])
def get_classes_session(class_id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM class_sessions WHERE class_id = %s", (class_id,))
        sessions = cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

    return sessions