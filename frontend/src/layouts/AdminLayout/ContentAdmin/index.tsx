import React from "react";
import { GridCol, Title, Text } from "../../../styled";
import styled from "styled-components";



const ContentAdmin: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
      <ContentWrapper>
        {children}
      </ContentWrapper>
  );
};

// Menu styling sử dụng styled-components cho từng item để đồng bộ theme


const ContentWrapper = styled.div`
  background: #f6fbff;
  box-shadow: 2px 0 8px rgba(34, 46, 60, 0.07);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  border-radius: 8px;
  border: 2px solid #000000;
  padding: 32px 0 0 0;
  margin: 10px 0 30px;
  height: 100%;
`;

export default ContentAdmin;
