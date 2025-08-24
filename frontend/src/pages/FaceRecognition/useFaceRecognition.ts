import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";

export function useFaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string>("Đang nhận diện...");
  const [recognized, setRecognized] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [lastScan, setLastScan] = useState<string>("");
  const [registering, setRegistering] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const scanningRef = useRef(true);

  useEffect(() => {
    startCamera();
    return () => {
      scanningRef.current = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          scanningRef.current = true;
          captureAndSend();
        };
      }
    } catch (err) {
      setResult(
        "Không thể mở camera: " + (err instanceof Error ? err.message : err)
      );
      scanningRef.current = false;
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureAndSend = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!scanningRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob || !scanningRef.current) return;
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await axios.post(API_URL + "/recognize/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLastScan(new Date().toLocaleTimeString());
        

        // Khi nhận diện thành công:
        if (res.data.status === "recognized") {
          setResult(`Xin chào, ${res.data.name}!`);
          setRecognized(true);
          setName(res.data.name || "");
          setImageUrl(res.data.image_url); // <-- truyền giá trị trả về vào state
          scanningRef.current = false;
          return;
        } else if (res.data.status === "no_face") {
          setResult("Không thấy khuôn mặt nào");
          setRecognized(false);
          setName("");
        } else if (res.data.status === "unknown") {
          setResult("Đang chờ khuôn mặt rõ hơn...");
          setRecognized(false);
          setName("");
        } else {
          setResult("Lỗi nhận diện!");
          setRecognized(false);
          setName("");
        }
      } catch (err) {
        setResult("Lỗi kết nối đến server");
      }
      if (scanningRef.current) setTimeout(captureAndSend, 1000);
    }, "image/jpeg");
  };

  const handleRefreshCamera = () => {
    stopCamera();
    startCamera();
    setResult("Đang nhận diện...");
    setRecognized(false);
    setLastScan("");
    setName("");
    scanningRef.current = true;
  };

  const handleRegister = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setRegistering(true);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setRegistering(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", blob, "register.jpg");
      const regName = prompt("Nhập tên để đăng ký cho khuôn mặt này:") || "NoName";
      formData.append("name", regName);
      try {
        await axios.post(API_URL + "/register/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setResult("Đăng ký thành công, vui lòng thử lại.");
      } catch (e) {
        setResult("Đăng ký thất bại");
      } finally {
        setRegistering(false);
      }
    }, "image/jpeg");
  };

  return {
    videoRef,
    canvasRef,
    result,
    recognized,
    name,
    lastScan,
    registering,
    handleRegister,
    handleRefreshCamera,
    imageUrl,
  };
}
