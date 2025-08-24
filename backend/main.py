from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import recognizer
from fastapi import Form
import pickle, json
from database import get_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sau này có thể giới hạn domain React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recognize/")
async def recognize(file: UploadFile = File(...)):
    # ... load ảnh, nhận diện như cũ
    results = recognizer.recognize_face(frame)
    if not results:
        return {"status": "no_face"}
    elif all("Unknown" in r for r in results):
        return {"status": "unknown"}
    else:
        name_out = results[0].split(" - ")[1] if " - " in results[0] else results[0]
        return {"status": "recognized", "name": name_out}


@app.post("/register/")
async def register(
    file: UploadFile = File(...),
    name: str = Form(...)
):
    image_bytes = await file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    rgb_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    encs = face_recognition.face_encodings(rgb_img)
    if not encs:
        return {"status": "failed", "msg": "Không phát hiện khuôn mặt!"}
    # Lưu vào DB:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        code = ""  # hoặc sinh code tự động | hoặc yêu cầu frontend gửi thêm MSSV?
        encodings_bytes = pickle.dumps(encs)
        cursor.execute(
            "INSERT INTO students (student_code, name, encodings, image_urls) VALUES (%s,%s,%s,%s)",
            (code, name, encodings_bytes, json.dumps({}))
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        return {"status": "error", "msg": str(e)}
    return {"status": "success", "msg": "Đăng ký thành công!"}