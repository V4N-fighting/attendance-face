import React, { useRef, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";





function getAbbrName(name: string) {
  if (!name) return "?";
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length-1][0]).toUpperCase();
}

function randomAvatarBg(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; ++i) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${(hash % 360)},78%,52%)`;
  return color;
}

const FaceRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string>("Đang nhận diện...");
  const [recognized, setRecognized] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [lastScan, setLastScan] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    scanInterval.current = setInterval(() => {
      if (scanning) {
        captureAndSend();
      }
    }, 1000);
    return () => {
      if (scanInterval.current) clearInterval(scanInterval.current);
      stopCamera();
    };
    // eslint-disable-next-line
  }, [scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
    } catch (err) {
      setResult("Không thể mở camera: " + (err instanceof Error ? err.message : err));
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureAndSend = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
      try {
        const res = await axios.post("http://localhost:8000/recognize/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("API Kết quả:", res.data)
        setLastScan(new Date().toLocaleTimeString());
        if (res.data.status === "recognize") {
          setResult(`Xin chào, ${res.data.name}!`);
          setRecognized(true);
          setName(res.data.name || "");
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
        console.error("API lỗi:", err);
        setResult("Lỗi kết nối đến server");
      }
      
    }, "image/jpeg");
  };

  const handleRegister = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setRegistering(true);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) { setRegistering(false); return; }
      const formData = new FormData();
      formData.append("file", blob, "register.jpg");
      const regName = prompt("Nhập tên để đăng ký cho khuôn mặt này:") || "NoName";
      formData.append("name", regName);
      try {
        await axios.post("http://localhost:8000/register/", formData, {
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

  const handleRefreshCamera = () => {
    stopCamera();
    startCamera();
    setResult("Đang nhận diện...");
    setRecognized(false);
    setLastScan("");
    setName("");
  };

  return (
    <AppBackground>
      <MainWrapper>
        <GlassPanel as="section">
          <PanelTitle>Webcam</PanelTitle>
          <VideoWrapper>
            <VideoStyled ref={videoRef} autoPlay width={640} height={480} />
            <FaceFrame />
          </VideoWrapper>
          <CanvasStyled ref={canvasRef} width={640} height={480} />

          <Button onClick={handleRefreshCamera}>🔄 Làm mới camera</Button>
          <MobileNote>Đề nghị xoay ngang hoặc dùng màn hình lớn để đạt trải nghiệm tốt nhất.</MobileNote>
        </GlassPanel>
        <GlassPanelDark as="section">
          <PanelTitle style={{color:'#fff',textShadow:'0 2px 12px #5f89f8'}}>Kết quả nhận diện</PanelTitle>
          {recognized && name ? (
            <AvatarCircle bg={randomAvatarBg(name)}>
              {getAbbrName(name)}
            </AvatarCircle>
          ) : <AvatarCircle bg="#dededa22" style={{color:'#ccc'}}>?</AvatarCircle>}
          <ResultBox style={{color: recognized?'#1cd6a3':'#ffe2ea',background: recognized?'rgba(33,245,150,0.15)':'rgba(255,18,60,0.12)'}}>
            {result}
          </ResultBox>
          <Meta>🕒 Lần quét gần nhất: <b>{lastScan || '-'}</b></Meta>
          {recognized
            ? <LightText>Đã nhận diện thành công. Chào mừng!</LightText>
            : <>
                <LightText>Chưa nhận diện được, hãy đặt khuôn mặt vào giữa khung hình.</LightText>
                <Button onClick={handleRegister} disabled={registering}>
                  {registering ? "Đang đăng ký..." : "Đăng ký khuôn mặt mới"}
                </Button>
              </>
          }
        </GlassPanelDark>
      </MainWrapper>
    </AppBackground>
  );
};

// Glassmorphism & pastel gradient background
const AppBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg,rgb(4, 255, 117) 0%,rgb(101, 246, 244) 40%,rgb(101, 246, 244) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.99); }
  to { opacity: 1; transform: none; }
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: transparent;
  gap: 48px;
  @media (max-width: 1100px) {
    flex-direction: column;
    gap: 26px;
  }
`;

const GlassPanel = styled.div`
  min-width: 360px;
  max-width: 500px;
  min-height: 600px;
  background: rgba(255,255,255,0.33);
  box-shadow: 0 12px 36px 0 rgba(60,20,130,0.18), 0 2px 8px #fef6f8;
  border-radius: 38px;
  padding: 56px 40px 44px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(16px) saturate(170%) contrast(1.03);
  border: 2.5px solid rgba(234,235,239,0.18);
  animation: ${fadeIn} 0.8s cubic-bezier(.63,1.43,.32,1) 1;
`;

const GlassPanelDark = styled(GlassPanel)`
  background: rgba(26,36,60,0.22);
  color: #fff;
  border: 2.5px solid rgba(88,111,166,0.22);
`;

const PanelTitle = styled.h2`
  font-size: 2.36rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin-bottom: 18px;
  color: #312157;
  text-shadow: 0 1.5px 8px #fff6, 0 0 #0000;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
`;

const VideoStyled = styled.video`
  border: 0;
  border-radius: 24px;
  box-shadow: 0 1.5px 34px 0 #8fe8ed50, 0 2px 7px #bfc5e580;
  background: #000;
  width: 390px;
  height: 300px;
  max-width: 98vw;
  max-height: 54vw;
  margin-bottom: 36px;
`;

const CanvasStyled = styled.canvas`
  display: none;
`;

const Button = styled.button`
  font-size: 1.09rem;
  padding: 13px 36px;
  margin-top: 26px;
  background: linear-gradient(95deg, #57c6e1, #7a70e7 85%);
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 6px 32px #79b2d618;
  letter-spacing: 0.02em;
  font-family: 'Montserrat', Arial, sans-serif;
  transition: all .16s cubic-bezier(.72,0,.41,1.18);
  &:hover:not(:disabled) {
    background: linear-gradient(105deg, #297cd6 60%, #9154d7);
    transform: scale(1.037) translateY(-2px);
    box-shadow: 0 10px 40px #6d77d6b8;
  }
  &:active:not(:disabled) {
    transform: scale(.99);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  width: 100%;
  min-height: 62px;
  padding: 20px 10px;
  background: rgba(250,254,255,0.55);
  border-radius: 18px;
  font-weight: 700;
  margin: 26px 0 16px 0;
  font-size: 1.12rem;
  color: #384052;
  box-shadow: 0 2px 8px #d1e2fd36;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
`;

const Meta = styled.div`
  font-size: 1.01rem;
  color: #8686bf;
  text-align: center;
  margin-bottom: 6px;
`;

const AvatarCircle = styled.div<{ bg: string }>`
  width: 100px;
  height: 100px;
  margin: 0 auto 18px auto;
  border-radius: 54px;
  background: ${p => p.bg};
  box-shadow: 0 4px 36px #fff8, 0 12px 28px #acadeb55;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.8rem;
  font-weight: 900;
  border: 5px solid #fff7;
  letter-spacing: 0.03em;
`;

const LightText = styled.div`
  font-size: .99rem;
  text-align: center;
  color: #dedcf7;
  margin: 12px 0 6px 0;
  font-style: italic;
`;

const MobileNote = styled.div`
  margin-top: 19px;
  color: #8880b9;
  font-size: .95rem;
  text-align: center;
  @media (min-width: 1100px) {
    display: none;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FaceFrame = styled.div`
  position: absolute;
  top: 44%;
  left: 50%;
  width: 200px;
  height: 242px;
  border: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;       /* không chặn video */
  background: transparent;    /* không che video */
`;

export default FaceRecognition;
