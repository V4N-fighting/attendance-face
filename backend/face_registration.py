import cv2
import mediapipe as mp
import time
import logging
import cloudinary.uploader
import requests
import numpy as np
import face_recognition
import pickle
import shutil
from database import Student, get_all_students
from face_utils import count_matching_encodings

cloudinary.config(
    cloud_name = "dhl6ddyzy",     # thay bằng cloud name của Ngọc
    api_key = "234154292366289",          # trong dashboard
    api_secret = "PypoFLxIRx0DkL1TMCB3alweU-w"     # trong dashboard
)

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

POSES = [
    ("front", "Nhìn thẳng vào camera"),
    ("left", "Quay mặt sang trái"),
    ("right", "Quay mặt sang phải"),
    ("up", "Ngước mặt lên"),
    ("down", "Cúi mặt xuống")
]
HOLD_TIME = 2
THRESHOLD_DUP = 0.43
POSE_REQUIRED_DUP = 2

# ===== INPUT MSSV_HOTEN =====
MSSV_HOTEN = input("Nhập MSSV_HOTEN (VD: 123456_NguyenVanA): ").strip()
if not MSSV_HOTEN:
    logging.error("Chưa nhập MSSV_HOTEN, thoát.")
    exit(1)

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
cap = cv2.VideoCapture(0)

pose_index = 0
hold_start = None
uploaded_urls = {}   # giữ link ảnh đã upload

# ----- Check pose -----
def check_pose(landmarks, w, h, pose_name):
    nose = landmarks[1]
    left_eye = landmarks[33]
    right_eye = landmarks[263]
    chin = landmarks[152]
    forehead = landmarks[10]
    nose_x, nose_y = int(nose.x * w), int(nose.y * h)
    left_eye_x = int(left_eye.x * w)
    right_eye_x = int(right_eye.x * w)
    chin_y = int(chin.y * h)
    forehead_y = int(forehead.y * h)
    if pose_name == "front":
        return abs(left_eye_x - (w - right_eye_x)) < 40
    elif pose_name == "left":
        return nose_x > w // 2 + 40
    elif pose_name == "right":
        return nose_x < w // 2 - 40
    elif pose_name == "up":
        return forehead_y < h // 3
    elif pose_name == "down":
        return chin_y > h * 2 // 3
    return False

logging.info("Bắt đầu ghi nhận ảnh. Nhấn ESC để huỷ.")
while cap.isOpened() and pose_index < len(POSES):
    success, frame = cap.read()
    if not success:
        break
    frame_orig = cv2.flip(frame, 1)
    frame = frame_orig.copy()
    h, w, _ = frame.shape
    center_x, center_y = w//2, h//2
    radius = min(w, h)//3
    cv2.circle(frame, (center_x, center_y), radius, (0,255,0),2)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    pose_name, instruction = POSES[pose_index]
    cv2.putText(frame, f"Bước {pose_index+1}: {instruction}", (30,50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,255),2)
    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        if check_pose(landmarks, w, h, pose_name):
            if hold_start is None:
                hold_start = time.time()
            elapsed = time.time() - hold_start
            cv2.putText(frame, f"Giữ yên... {elapsed:.1f}/{HOLD_TIME}s", (30,100),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
            if elapsed >= HOLD_TIME:
                # ---- upload ảnh lên Cloudinary ----
                ret, buf = cv2.imencode(".jpg", frame_orig)
                upload_result = cloudinary.uploader.upload(
                    buf.tobytes(),
                    folder=f"faces/{MSSV_HOTEN}"
                )
                image_url = upload_result["secure_url"]
                logging.info(f"Đã upload {pose_name} lên Cloudinary: {image_url}")

                uploaded_urls[pose_name] = image_url
                pose_index += 1
                hold_start = None
                time.sleep(1)
        else:
            hold_start = None
    else:
        hold_start = None

    cv2.imshow("Dang ky khuon mat", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        logging.info("Huỷ đăng ký")
        break
cap.release()
cv2.destroyAllWindows()

# ----- Encode từ ảnh Cloudinary -----
def get_poses_encodings(urls_dict):
    encodings = []
    for pose, url in urls_dict.items():
        try:
            resp = requests.get(url)
            img_array = np.frombuffer(resp.content, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encs = face_recognition.face_encodings(rgb_img)
            if encs:
                encodings.append(encs[0])
        except Exception as e:
            logging.error(f"Lỗi tải/encode ảnh {pose}: {e}")
    return encodings

encodings_list = get_poses_encodings(uploaded_urls)
if len(encodings_list) == 0:
    logging.error("Không thể encode khuôn mặt từ ảnh Cloudinary! Hủy.")
    exit(3)

# ----- Check duplicate -----
def is_duplicate(new_encodings, existing_students, threshold=THRESHOLD_DUP, require_pose=POSE_REQUIRED_DUP):
    for stu in existing_students:
        # Bỏ qua nếu không có encodings
        if not stu.get("encodings"):
            continue
        match = 0
        for enc_new in new_encodings:
            cnt, min_dist, _ = count_matching_encodings(stu["encodings"], enc_new, threshold)

            if cnt > 0:
                match += 1
        if match >= require_pose:
            logging.warning(f"[DUPLICATE] Đã tồn tại khuôn mặt tương tự: {stu['code']} - {stu['name']}")
            return True
    return False

all_students = get_all_students()
if is_duplicate(encodings_list, all_students):
    exit(2)

# ----- Ghi vào DB -----
def insert_student(code, name, encodings_bytes, image_urls_json):
    import mysql.connector
    from database import DB_HOST,DB_USER,DB_PASSWORD,DB_NAME
    import json
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO students (student_code, name, encodings, image_urls) VALUES (%s,%s,%s,%s)",
            (code, name, encodings_bytes, image_urls_json)
        )
        conn.commit()
        cursor.close()
        conn.close()
        logging.info(f"Đã lưu {code} - {name} vào DB!")
        return True
    except mysql.connector.Error as e:
        logging.error(f"Lỗi DB: {e}")
        return False

import json
try:
    student_code, hoten = MSSV_HOTEN.split("_",1)
except ValueError:
    student_code, hoten = MSSV_HOTEN, ""

encodings_bytes = pickle.dumps(encodings_list)
saved = insert_student(student_code, hoten, encodings_bytes, json.dumps(uploaded_urls))
if not saved:
    logging.error("Lưu DB thất bại")
    exit(4)

logging.info("[DONE] Hoàn tất đăng ký. Dữ liệu đã lưu vào DB.")
exit(0)
