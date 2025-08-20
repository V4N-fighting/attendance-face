from flask import Blueprint, jsonify, request
from db import get_db_connection

classes_bp = Blueprint('classes', __name__)

# Lấy danh sách lớp
@classes_bp.route('/classes', methods=['GET'])
def get_classes():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM classes")
    classes = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(classes)

# Thêm lớp học
@classes_bp.route('/classes', methods=['POST'])
def add_class():
    data = request.json
    name = data.get("name")
    teacher = data.get("teacher")

    if not name:
        return jsonify({"error": "Thiếu tên lớp"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute("INSERT INTO classes (name, teacher) VALUES (%s, %s)", (name, teacher))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({"id": new_id, "name": name, "teacher": teacher}), 201

# Cập nhật lớp học
@classes_bp.route('/classes/<int:id>', methods=['PUT'])
def update_class(id):
    data = request.json
    name = data.get("name")
    teacher = data.get("teacher")

    if not name:
        return jsonify({"error": "Thiếu tên lớp"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute("UPDATE classes SET name=%s, teacher=%s WHERE id=%s", (name, teacher, id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"id": id, "name": name, "teacher": teacher})

# Xóa lớp học
@classes_bp.route('/classes/<int:id>', methods=['DELETE'])
def delete_class(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute("DELETE FROM classes WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Xóa lớp thành công", "id": id})
