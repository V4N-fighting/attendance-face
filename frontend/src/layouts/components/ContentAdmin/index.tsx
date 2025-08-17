import React from "react";
import { GridCol, Title, Text } from "../../../styled";
import styled from "styled-components";



const ContentAdmin: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <GridCol col={9}>
      <ContentWrapper>
        <Title big blue style={{ textAlign: 'center', marginBottom: 32, textTransform: 'uppercase' }}>
          Content tới chơi
        </Title>
        {children}
      </ContentWrapper>
    </GridCol>
  );
};

// Menu styling sử dụng styled-components cho từng item để đồng bộ theme


const ContentWrapper = styled.div`
  background: #f6fbff;
  min-height: 100vh;
  border-radius: 0.7rem 0 0 0.7rem;
  box-shadow: 2px 0 8px rgba(34, 46, 60, 0.07);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 32px 0 0 0;
`;

export default ContentAdmin;
