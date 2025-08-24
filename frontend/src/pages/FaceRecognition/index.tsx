import React from "react";
import {
  AppBackground, MainWrapper, GlassPanel, GlassPanelDark, PanelTitle,
  VideoWrapper, VideoStyled, FaceFrame, CanvasStyled, Button,
  MobileNote, ResultBox, AvatarCircle, LightText, Meta
} from "./FaceRecognition.styled";
import { useFaceRecognition } from "./useFaceRecognition";
import { getAbbrName, randomAvatarBg } from "./faceUtils";

const FaceRecognition: React.FC = () => {
  const {
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
    } = useFaceRecognition();

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
          <PanelTitle style={{ color: '#fff', textShadow: '0 2px 12px #5f89f8' }}>Kết quả nhận diện</PanelTitle>
          {recognized && imageUrl ? (
            <img src={imageUrl} alt={name} style={{
              width: 100, height: 100, borderRadius: '54px',
              margin: '0 auto 18px auto', border: '5px solid #fff7', objectFit: 'cover',
              boxShadow: '0 4px 36px #fff8, 0 12px 28px #acadeb55'
            }} />
          ) : (
            <AvatarCircle bg={randomAvatarBg(name)}>
              {getAbbrName(name)}
            </AvatarCircle>
          )}
          <ResultBox style={{ color: recognized ? 'red' : '#ffe2ea', background: recognized ? 'rgba(33,245,150,0.15)' : 'rgba(255,18,60,0.12)' }}>
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

export default FaceRecognition;