import React, { useState } from "react";
import styled from "styled-components";
import { Plus, Trash2, Settings, Shield } from "lucide-react";



// ---------------- Sample Data ----------------
interface Admin {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Teacher";
}

const initialAdmins: Admin[] = [
  { id: 1, name: "Nguyễn Văn A", email: "adminA@university.edu", role: "Super Admin" },
  { id: 2, name: "Trần Thị B", email: "adminB@university.edu", role: "Admin" },
  { id: 3, name: "Lê Văn C", email: "teacherC@university.edu", role: "Teacher" },
];

// ---------------- Component ----------------
const SystemManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);

  const handleDelete = (id: number) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý hệ thống</Title>
        <Button primary>
          <Plus size={18} /> Thêm tài khoản
        </Button>
      </Header>

      {/* Admin Accounts */}
      <Table>
        <thead>
          <tr>
            <Th>Tên</Th>
            <Th>Email</Th>
            <Th>Vai trò</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <Td>{admin.name}</Td>
              <Td>{admin.email}</Td>
              <Td>
                <RoleTag role={admin.role}>{admin.role}</RoleTag>
              </Td>
              <Td>
                <Button>
                  <Shield size={16} /> Phân quyền
                </Button>
                <Button onClick={() => handleDelete(admin.id)}>
                  <Trash2 size={16} /> Xóa
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Settings */}
      <Title>Cài đặt hệ thống</Title>
      <Button>
        <Settings size={18} /> Cấu hình Email Server
      </Button>
      <Button>
        <Settings size={18} /> API Key cho Face Recognition
      </Button>
    </Container>
  );
};

// ---------------- Styled Components ----------------
const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const Button = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => (props.primary ? "#2563eb" : "#f3f4f6")};
  color: ${(props) => (props.primary ? "#fff" : "#374151")};
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.primary ? "#1d4ed8" : "#e5e7eb")};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const RoleTag = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: ${(props) =>
    props.role === "Super Admin"
      ? "#9333ea"
      : props.role === "Admin"
      ? "#2563eb"
      : "#10b981"};
`;

export default SystemManagement;
