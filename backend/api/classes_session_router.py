from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import mysql.connector
import os
from dotenv import load_dotenv
from db import get_db_connection
from datetime import datetime
from pydantic import BaseModel, validator
from typing import Optional

load_dotenv()

router = APIRouter()

class ClassSessionModel(BaseModel):
    id: Optional[int] = None
    class_id: int
    topic: str
    start_time: datetime
    end_time: datetime
    room: str




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
def get_class_sessions_by_class_id(class_id: int):
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

# Xóa
@router.delete("/classes_session/{id}")
def delete_class_session(id: int):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM class_sessions WHERE id = %s", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy session")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

    return {"message": "Đã xóa thành công", "id": id}

# Thêm mới
@router.post("/classes_session", response_model=ClassSessionModel)
def create_class_session(session: ClassSessionModel):
    print(">>> Payload nhận được:", session)
    print(">>> Kiểu dữ liệu:", type(session.start_time), type(session.end_time))
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT INTO class_sessions (class_id, topic, start_time, end_time, room)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (session.class_id, session.topic, session.start_time, session.end_time, session.room),
        )
        conn.commit()
        session.id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    return session


# Cập nhật
@router.put("/classes_session/{id}", response_model=ClassSessionModel)
def update_class_session(id: int, session: ClassSessionModel):
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            UPDATE class_sessions
            SET class_id=%s, topic=%s, start_time=%s, end_time=%s, room=%s
            WHERE id=%s
            """,
            (session.class_id, session.topic, session.start_time, session.end_time, session.room, id),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    session.id = id
    return session