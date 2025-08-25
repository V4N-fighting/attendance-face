import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Upload, Edit2, Trash2, Image } from "lucide-react";
import { getStudents } from "../../../services/studentService";
import Loader from "../../../Components/Loader";


// ---------------- Types ----------------
interface FacialDataItem {
  created_at: string; 
  id: number;
  name: string;
  student_code: string;
  image_urls: { [key: string]: string } | null;
}



// ---------------- Component ----------------
const FacialData: React.FC = () => {
  const [facialData, setFacialData] = useState<FacialDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<FacialDataItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: string } | null>(null);
  // Load data
  const loadFacialData = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      const facialDataItems: FacialDataItem[] = data.map(student => ({
        id: student.id || 0, // Provide a default value if id is optional
        name: student.name,
        student_code: student.student_code,
        image_urls: student.image_urls,
        created_at: student.created_at,
      }));
      setFacialData(facialDataItems);
    } catch (err) {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacialData();
  }, []);

  // Search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(facialData);
    } else {
      setFiltered(
        facialData.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.student_code.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, facialData]);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý dữ liệu khuôn mặt</Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <SearchBox>
            <Search size={18} />
            <input type="text" placeholder="Tìm sinh viên..." onChange={(e) => setSearch(e.target.value)} />
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
            <Th>STT</Th>
            <Th>MSSV</Th>
            <Th>Sinh viên</Th>
            <Th>Ảnh mẫu</Th>
            <Th>Ngày cập nhật</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((data) => (
            <tr key={data.id}>
              <Td>{filtered.indexOf(data) + 1}</Td>
              <Td>{data.student_code}</Td>
              <Td>{data.name}</Td>
              <Td>
                <ImageBox>
                  {data.image_urls && Object.keys(data.image_urls).length > 0 ? (
                    <img
                      src={data.image_urls.front || Object.values(data.image_urls)[0]}
                      alt={data.name}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedImages({ ...data.image_urls, _studentName: data.name });
                        setModalOpen(true);
                      }}
                    />
                  ) : (
                    <Image size={20} color="#9ca3af" />
                  )}
                </ImageBox>
              </Td>
              <Td>{data.created_at}</Td>
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
  
      {/* MODAL SHOW ALL POSES */}
      {modalOpen && selectedImages && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{marginTop:0, marginBottom: 25}}>
              Ảnh các tư thế - {selectedImages._studentName || ""}
            </h2>
            <PoseGrid>
              {[
                { key: "front", label: "Chính diện" },
                { key: "left", label: "Nghiêng trái" },
                { key: "right", label: "Nghiêng phải" },
                { key: "up", label: "Ngước lên" },
                { key: "down", label: "Cúi xuống" },
              ].map(({ key, label }) => (
                <PoseSlot key={key}>
                  <PoseLabel>{label}</PoseLabel>
                  {selectedImages[key] ? (
                    <img src={selectedImages[key]} alt={label} />
                  ) : (
                    <PoseMissing>Không có ảnh</PoseMissing>
                  )}
                </PoseSlot>
              ))}
            </PoseGrid>
            <CloseButton onClick={() => setModalOpen(false)}>Đóng</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

// ---------------- Styled Components ----------------
const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
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
  table-layout: fixed;

  thead {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  tbody {
    display: block;
    max-height: 400px;
    overflow-y: auto;
    width: 100%;
  }

  tr {
    display: table;
    table-layout: fixed;
    width: 100%;
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const ModalContent = styled.div`
  background: #fff;
  padding: 32px 24px 24px 24px;
  border-radius: 12px;
  max-width: 100%;
  width: 1240px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PoseGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;
  margin: 12px 0 18px 0;
`;
const PoseSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  min-height: 120px;
  justify-content: flex-start;
  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
  }
`;
const PoseLabel = styled.div`
  font-size: 16px;
  color: #374151;
  font-weight:500;
  margin-bottom: 6px;
`;
const PoseMissing = styled.div`
  background: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
  min-width: 200px;
  min-height: 200px;
  width: 200px;
  height: 200px;
`;
const CloseButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  font-size: 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
`;

export default FacialData;
