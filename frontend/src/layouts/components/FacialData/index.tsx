import React from "react";
import styled from "styled-components";
import { Search, Upload, Edit2, Trash2, Image } from "lucide-react";



// ---------------- Types ----------------
interface FacialDataItem {
  id: number;
  studentName: string;
  imageUrl: string | null;
  updatedAt: string;
}

// ---------------- Sample Data ----------------
const facialData: FacialDataItem[] = [
  {
    id: 1,
    studentName: "Nguyễn Văn A",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    updatedAt: "2025-08-01",
  },
  {
    id: 2,
    studentName: "Trần Thị B",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    updatedAt: "2025-08-10",
  },
  {
    id: 3,
    studentName: "Lê Văn C",
    imageUrl: null,
    updatedAt: "Chưa có",
  },
];

// ---------------- Component ----------------
const FacialData: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý dữ liệu khuôn mặt</Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <SearchBox>
            <Search size={18} />
            <input type="text" placeholder="Tìm sinh viên..." />
          </SearchBox>
          <Button primary>
            <Upload size={18} /> Upload dữ liệu
          </Button>
        </div>
      </Header>

      {/* Table */}
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Sinh viên</Th>
            <Th>Ảnh mẫu</Th>
            <Th>Ngày cập nhật</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {facialData.map((data) => (
            <tr key={data.id}>
              <Td>{data.id}</Td>
              <Td>{data.studentName}</Td>
              <Td>
                <ImageBox>
                  {data.imageUrl ? (
                    <img src={data.imageUrl} alt={data.studentName} />
                  ) : (
                    <Image size={20} color="#9ca3af" />
                  )}
                </ImageBox>
              </Td>
              <Td>{data.updatedAt}</Td>
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

const ImageBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

export default FacialData;
