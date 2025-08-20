from flask import Blueprint, jsonify
from db import get_db_connection

students_count_bp = Blueprint('students_count', __name__)

@students_count_bp.route('/students_count', methods=['GET'])
def get_students_count():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) FROM students")
    count = cursor.fetchone()["COUNT(*)"]
    cursor.close()
    conn.close()

    return jsonify({"count": count})