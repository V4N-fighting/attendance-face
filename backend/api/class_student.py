from flask import Blueprint, jsonify, request
from db import get_db_connection

class_student_bp = Blueprint('class_student', __name__)

# Lấy toàn bộ danh sách quan hệ class-student
@class_student_bp.route('/class_student', methods=['GET'])
def get_class_students():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM class_student")
    records = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(records)


# Thêm sinh viên vào lớp
@class_student_bp.route('/class_student', methods=['POST'])
def add_class_student():
    data = request.json
    class_id = data.get("class_id")
    student_id = data.get("student_id")

    if not class_id or not student_id:
        return jsonify({"error": "Thiếu class_id hoặc student_id"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO class_student (class_id, student_id) VALUES (%s, %s)",
            (class_id, student_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Thêm sinh viên vào lớp thành công",
                        "class_id": class_id, "student_id": student_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Cập nhật quan hệ class-student (hiếm khi cần, nhưng để đầy đủ)
@class_student_bp.route('/class_student/<int:class_id>/<int:student_id>', methods=['PUT'])
def update_class_student(class_id, student_id):
    data = request.json
    new_class_id = data.get("class_id")
    new_student_id = data.get("student_id")

    if not new_class_id or not new_student_id:
        return jsonify({"error": "Thiếu class_id hoặc student_id mới"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute(
        "UPDATE class_student SET class_id=%s, student_id=%s WHERE class_id=%s AND student_id=%s",
        (new_class_id, new_student_id, class_id, student_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Cập nhật quan hệ thành công",
        "old_class_id": class_id,
        "old_student_id": student_id,
        "new_class_id": new_class_id,
        "new_student_id": new_student_id
    })


# Xóa sinh viên khỏi lớp
@class_student_bp.route('/class_student/<int:class_id>/<int:student_id>', methods=['DELETE'])
def delete_class_student(class_id, student_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM class_student WHERE class_id=%s AND student_id=%s",
        (class_id, student_id)
    )
    conn.commit()
    rows = cursor.rowcount
    cursor.close()
    conn.close()

    if rows > 0:
        return jsonify({"message": "Xóa sinh viên khỏi lớp thành công",
                        "class_id": class_id, "student_id": student_id})
    else:
        return jsonify({"error": "Không tìm thấy bản ghi để xóa"}), 404

# Tổng số sinh viên của 1 lớp
@class_student_bp.route('/class_student_count/<int:class_id>', methods=['GET'])
def get_class_student_count(class_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT COUNT(*) AS count FROM class_student WHERE class_id=%s", (class_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    count = int(row["count"]) if row and "count" in row else 0
    return jsonify({"count": count})

# Danh sách sinh viên của lớp
@class_student_bp.route('/class_student/<int:class_id>/students', methods=['GET'])
def get_students_by_class(class_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Không thể kết nối DB"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute(
    "SELECT id, name, student_code FROM students WHERE id IN (SELECT student_id FROM class_student WHERE class_id=%s)",
    (class_id,)
)

    students = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(students)