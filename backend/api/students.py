from flask import Blueprint, jsonify, request
from db import get_db_connection
import json
students_bp = Blueprint('students', __name__)

# Lấy danh sách sinh viên
@students_bp.route('/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, student_code, image_urls, created_at FROM students")
    students = cursor.fetchall()
    cursor.close()
    conn.close()

    # Parse image_urls từ string sang dict
    for stu in students:
        if stu["image_urls"]:
            try:
                stu["image_urls"] = json.loads(stu["image_urls"])
            except json.JSONDecodeError:
                stu["image_urls"] = {}

    return jsonify(students)

# Thêm sinh viên
@students_bp.route('/students', methods=['POST'])
def add_student():
    data = request.json
    name = data.get('name')
    student_code = data.get('student_code')

    if not name or not student_code:
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO students (name, student_code) VALUES (%s, %s)",
        (name, student_code)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({"id": new_id, "name": name, "student_code": student_code}), 201

# Sửa sinh viên
@students_bp.route('/students/<int:id>', methods=['PUT'])
def update_student(id):
    data = request.json
    name = data.get('name')
    student_code = data.get('student_code')

    if not name or not student_code:
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute(
        "UPDATE students SET name=%s, student_code=%s WHERE id=%s",
        (name, student_code, id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"id": id, "name": name, "student_code": student_code})

# Xóa sinh viên
@students_bp.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    try:
        cursor = conn.cursor()

        # Xóa quan hệ trong class_student trước
        cursor.execute("DELETE FROM class_student WHERE student_id=%s", (id,))

        # Xóa sinh viên
        cursor.execute("DELETE FROM students WHERE id=%s", (id,))
        conn.commit()

        rows = cursor.rowcount  # số dòng xóa từ bảng students
        cursor.close()
        conn.close()

        if rows > 0:
            return jsonify({"message": "Đã xóa sinh viên và quan hệ liên quan", "id": id}), 200
        else:
            return jsonify({"error": "Không tìm thấy sinh viên để xóa"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
