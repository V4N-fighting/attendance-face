from flask import Blueprint, jsonify
from db import get_db_connection

classes_count_bp = Blueprint('classes_count', __name__)

@classes_count_bp.route('/classes_count', methods=['GET'])
def get_classes_count():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) FROM classes")
    count = cursor.fetchone()["COUNT(*)"]
    cursor.close()
    conn.close()

    return jsonify({"count": count})