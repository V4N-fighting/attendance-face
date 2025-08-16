import face_recognition
import cv2
import numpy as np
import logging
from database import get_all_students
from face_utils import count_matching_encodings

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

THRESHOLD = 0.45   # Có thể tinh chỉnh sau
POSE_REQUIRED = 2  # >= Bao nhiêu pose dưới threshold thì nhận là cùng người

# Load students từ DB
logging.info("Loading students from DB...")
students = get_all_students()
logging.info(f"Loaded {len(students)} students.")

if not students:
    logging.error('No student data found in DB!')
    exit(1)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Nhận diện trên frame resize 0.5
    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    for (top, right, bottom, left), encoding in zip(face_locations, face_encodings):
        best_student = None
        best_count = 0
        best_min_dist = 1e9
        best_dist = None
        for student in students:
            match_count, min_dist, distances = count_matching_encodings(student.encodings, encoding, THRESHOLD)
            logging.debug(f"[%s] Dists: %s | Match count: %d", f"{student.code}-{student.name}", distances, match_count)
            if match_count > best_count or (match_count == best_count and min_dist < best_min_dist):
                best_count = match_count
                best_min_dist = min_dist
                best_student = student
                best_dist = distances
        name_display = "Unknown"
        if best_count >= POSE_REQUIRED:
            name_display = f"{best_student.code} - {best_student.name}"
        # Scale lại vị trí rectangle
        top *= 2
        right *= 2
        bottom *= 2
        left *= 2
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
        cv2.putText(frame, name_display, (left + 6, bottom - 6),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    cv2.imshow('Face Recognition', frame)
    if cv2.waitKey(1) & 0xFF == 27:
        logging.info("Thoát chương trình nhận diện khuôn mặt.")
        break

cap.release()
cv2.destroyAllWindows()
