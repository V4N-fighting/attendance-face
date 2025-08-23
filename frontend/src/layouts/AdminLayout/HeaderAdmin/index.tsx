import React, { useState } from 'react';
import {
  RowBetween,
  FlexBox,
  Title,
  Text,
  Icon,
} from '../../../styled';
import styled from 'styled-components';
import Icons from '../../../Components/BaseComponent/Icons';

const admin = {
  name: "NgocVan",
  avatarUrl: "https://i.pravatar.cc/36?img=12",
};

interface HeaderAdminProps {
    curTitle: string;
}

const HeaderAdmin: React.FC<HeaderAdminProps> = ({curTitle}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(true);

  const handleDropdownToggle = () => {
    setDropdownOpen((open) => !open);
  };

  const handleMenuClick = (action: string) => {
    setDropdownOpen(false);
    // Implement chức năng theo action (profile, changePassword, logout)
  };

  return (
    <HeaderWrapper>
      {/* Logo + Page Name */}
      <FlexBox>
        <Logo src="https://cdn.mos.cms.futurecdn.net/Mc95h2mKmhKJRYXEGLaTaX.jpg" alt="Logo" />
        <Title medium style={{ margin: 0 }}>{curTitle}</Title>
      </FlexBox>
      {/* Right: Notification + Admin */}
      <FlexBox style={{ justifyContent: 'flex-end', width: 'auto' }}>
        <Notification onClick={() => alert("Chức năng đang dược phát triển")}>
          <Icons.BellIcon />
          {isNotification && <Badge />}
        </Notification>
        <AdminBox onClick={handleDropdownToggle}>
          <Avatar src={admin.avatarUrl} alt="Avatar" />
          <Text bold style={{ margin: 0, width: 'auto' }}>{admin.name}</Text>
          <Icons.ChevronDownIcon style={{ marginLeft: 6 }} />
          {dropdownOpen && (
            <Dropdown>
              <DropdownItem onClick={() => handleMenuClick('profile')}>
                Trang cá nhân
              </DropdownItem>
              <DropdownItem onClick={() => handleMenuClick('changePassword')}>
                Đổi mật khẩu
              </DropdownItem>
              <DropdownItem onClick={() => handleMenuClick('logout')}>
                Logout
              </DropdownItem>
            </Dropdown>
          )}
        </AdminBox>
      </FlexBox>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled(RowBetween)`
    position: relative;
    z-index: 20;
    align-items: center;
    background: #fff;
    box-shadow: 0 2px 8px #f0f1f2;
    border: 2px solid #000000;
    border-radius: 8px;
    padding: 12px 24px;
    margin: 20px 0;
    height: 110px;
`;

const Logo = styled.img`
    height: 40px;
    margin-right: 16px;
`;

const Notification = styled.div`
  margin-right: 24px;
  cursor: pointer;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  border: 2px solid #fff;
  display: inline-block;
`;

const AdminBox = styled(FlexBox)`
  position: relative;
  align-items: center;
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 110%;
  background: #fff;
  border: 1px solid #000000;
  border-radius: 6px;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  min-width: 160px;
  z-index: 30;
`;
const DropdownItem = styled.div`
  padding: 10px 18px;
  cursor: pointer;
  &:hover {
    background: #f7f7f7;
  }
  &:last-child {
    color: red;
    border-top: 1px solid #f3f3f3;
  }
`;

export default HeaderAdmin;
