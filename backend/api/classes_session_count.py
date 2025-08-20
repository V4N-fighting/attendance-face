from flask import Blueprint, jsonify
from db import get_db_connection

classes_session_count_bp = Blueprint('classes_session_count', __name__)

@classes_session_count_bp.route('/classes_session_count/today', methods=['GET'])
def get_today_classes_session_count():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

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

    return jsonify({"count": count})
