import face_recognition
import cv2
from database import get_all_students
from face_utils import count_matching_encodings

THRESHOLD = 0.45
POSE_REQUIRED = 2

students = get_all_students()

def recognize_face(frame):
    """Nhận diện khuôn mặt trên 1 frame (ảnh numpy array)"""
    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    results = []

    for encoding in face_encodings:
        best_student = None
        best_count = 0
        best_min_dist = 1e9
        for student in students:
            if not student.get("encodings"):
                continue
            match_count, min_dist, distances = count_matching_encodings(
                student["encodings"], encoding, THRESHOLD
            )
            if match_count > best_count or (match_count == best_count and min_dist < best_min_dist):
                best_count = match_count
                best_min_dist = min_dist
                best_student = student

        if best_count >= POSE_REQUIRED and best_student:
            results.append(f"{best_student.get('code', '')} - {best_student.get('name', '')}")
        else:
            results.append("Unknown")

    return results
