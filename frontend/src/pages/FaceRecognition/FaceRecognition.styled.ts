import styled, { keyframes } from "styled-components";

export const AppBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg,rgb(4, 255, 117) 0%,rgb(101, 246, 244) 40%,rgb(101, 246, 244) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.99); }
  to { opacity: 1; transform: none; }
`;

export const MainWrapper = styled.div`
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

export const GlassPanel = styled.div`
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

export const GlassPanelDark = styled(GlassPanel)`
  background: rgba(26,36,60,0.22);
  color: #fff;
  border: 2.5px solid rgba(88,111,166,0.22);
`;

export const PanelTitle = styled.h2`
  font-size: 2.36rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin-bottom: 18px;
  color: #312157;
  text-shadow: 0 1.5px 8px #fff6, 0 0 #0000;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
`;

export const VideoStyled = styled.video`
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

export const CanvasStyled = styled.canvas`
  display: none;
`;

export const Button = styled.button`
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

export const ResultBox = styled.div`
  width: 100%;
  min-height: 62px;
  padding: 20px 10px;
  background: rgba(250,254,255,0.55);
  border-radius: 18px;
  font-weight: 700;
  margin: 26px 0 16px 0;
  font-size: 1.12rem;
  color:rgb(255, 11, 6);
  box-shadow: 0 2px 8px #d1e2fd36;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
`;

export const Meta = styled.div`
  font-size: 1.01rem;
  color: #8686bf;
  text-align: center;
  margin-bottom: 6px;
`;

export const AvatarCircle = styled.div<{ bg: string }>`
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

export const LightText = styled.div`
  font-size: .99rem;
  text-align: center;
  color: #dedcf7;
  margin: 12px 0 6px 0;
  font-style: italic;
`;

export const MobileNote = styled.div`
  margin-top: 19px;
  color: #8880b9;
  font-size: .95rem;
  text-align: center;
  @media (min-width: 1100px) {
    display: none;
  }
`;

export const VideoWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const FaceFrame = styled.div`
  position: absolute;
  top: 44%;
  left: 50%;
  width: 200px;
  height: 242px;
  border: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background: transparent;
`;
