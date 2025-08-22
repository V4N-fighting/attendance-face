import React, { ReactNode } from "react";
import styled from "styled-components";


const SidebarAdmin: React.FC<{sidebar: {
  title: string, 
  path: string,
  icon: ReactNode
}[], setCurrentIndex: React.Dispatch<React.SetStateAction<number>>}> = ({sidebar, setCurrentIndex}) => {
    
  return (
    <SidebarWrapper>
        <SidebarMenu>
          {sidebar?.map((item, index) => (
            <MenuItem 
              key={item.title}
              onClick={() => {setCurrentIndex(index); window.location.href = item.path}}>
              {item.icon}
              {item.title}
            </MenuItem>
          ))}
        </SidebarMenu>
    </SidebarWrapper>
  );
};



// Menu styling sử dụng styled-components cho từng item để đồng bộ theme
const SidebarWrapper = styled.div`
  background: #f6fbff;
  border-radius: 8px;
  box-shadow: 2px 0 8px rgba(34, 46, 60, 0.07);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 32px 0 0 0;
  border: 2px solid #000000;
  margin: 10px 0 20px;
  height: 100%;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1.07rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  transition: background 0.2s;
  color: #213555;
  margin-bottom: 8px;
  &:hover {
    background: #e5f6fd;
  }
  svg, span.emoji {
    margin-right: 14px;
  }
`;



export default SidebarAdmin;
