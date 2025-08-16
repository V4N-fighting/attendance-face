import numpy as np
import face_recognition

# Tính số lượng encoding cùng dưới threshold

def count_matching_encodings(encodings, encoding, threshold):
    if len(encodings) == 0:
        return 0, 1e9
    distances = face_recognition.face_distance(encodings, encoding)
    match_count = np.sum(distances <= threshold)
    min_dist = np.min(distances) if len(distances) > 0 else 1e9
    return match_count, min_dist, distances
