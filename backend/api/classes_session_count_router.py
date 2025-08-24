from fastapi import APIRouter, HTTPException
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

@router.get("/classes_session_count/today")
def get_today_classes_session_count():
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Không thể kết nối DB")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT COUNT(*) AS count 
        FROM class_sessions 
        WHERE DATE(start_time) = CURDATE()
    """)
    result = cursor.fetchone()
    count = result["count"]
    cursor.close()
    conn.close()
    return {"count": count}
