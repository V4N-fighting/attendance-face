import React from "react";
import styled from "styled-components";
import { Search, Plus, Edit2, Trash2, Users } from "lucide-react";



// ---------------- Types ----------------
interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  studentCount: number;
}

// ---------------- Sample Data ----------------
const classes: ClassItem[] = [
  { id: 1, name: "CNTT1", teacher: "Thầy Nguyễn Văn A", studentCount: 45 },
  { id: 2, name: "CNTT2", teacher: "Cô Trần Thị B", studentCount: 38 },
  { id: 3, name: "CNTT3", teacher: "Thầy Lê Văn C", studentCount: 50 },
];

// ---------------- Component ----------------
const Classes: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý lớp học</Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <SearchBox>
            <Search size={18} />
            <input type="text" placeholder="Tìm lớp học..." />
          </SearchBox>
          <Button primary>
            <Plus size={18} /> Thêm lớp
          </Button>
        </div>
      </Header>

      {/* Table */}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Tên lớp</Th>
            <Th>Giảng viên</Th>
            <Th>Số lượng SV</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <Td>{cls.id}</Td>
              <Td>{cls.name}</Td>
              <Td>{cls.teacher}</Td>
              <Td>
                <Users size={16} style={{ marginRight: "6px" }} />
                {cls.studentCount}
              </Td>
              <Td>
                <Actions>
                  <Edit2 size={18} />
                  <Trash2 size={18} />
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 12px;
  gap: 8px;
  background: #fff;
  width: 300px;

  input {
    border: none;
    outline: none;
    flex: 1;
  }
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
  font-size: 14px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;

  svg {
    cursor: pointer;
    color: #6b7280;

    &:hover {
      color: #111827;
    }
  }
`;

export default Classes;
