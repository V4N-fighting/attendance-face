from flask import Blueprint, jsonify
from db import get_db_connection

classes_session_bp = Blueprint('classes_session', __name__)

@classes_session_bp.route('/classes_session', methods=['GET'])
def get_classes_session():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM class_sessions")
    classes_session = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(classes_session)
