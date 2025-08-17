import React from "react";
import { GridCol, Title, Text } from "../../../styled";
import styled from "styled-components";



const SidebarAdmin: React.FC = () => {
  return (
    <GridCol col={3}>
      <SidebarWrapper>
        <Title big blue style={{ textAlign: 'center', marginBottom: 32, textTransform: 'uppercase' }}>
          Quản trị
        </Title>
        <SidebarMenu>
          <MenuItem>
            <span className="emoji">👨‍🎓</span> Thêm sinh viên
          </MenuItem>
          <MenuItem>
            <span className="emoji">✏️</span> Sửa sinh viên
          </MenuItem>
          <MenuItem>
            <span className="emoji">🗑️</span> Xóa sinh viên
          </MenuItem>
          <MenuItem>
            <span className="emoji">🔍</span> Tìm kiếm sinh viên
          </MenuItem>
          <MenuItem>
            <span className="emoji">📓</span> Nhật ký điểm danh
          </MenuItem>
          <MenuItem>
            <span className="emoji">⏰</span> Giờ giấc (muộn, ...)
          </MenuItem>
        </SidebarMenu>
      </SidebarWrapper>
    </GridCol>
  );
};

// Menu styling sử dụng styled-components cho từng item để đồng bộ theme
const SidebarMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
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

const SidebarWrapper = styled.div`
  background: #f6fbff;
  min-height: 100vh;
  border-radius: 0.7rem 0 0 0.7rem;
  box-shadow: 2px 0 8px rgba(34, 46, 60, 0.07);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 32px 0 0 0;
`;

export default SidebarAdmin;
