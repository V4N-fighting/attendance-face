import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Edit2, Trash2, Users } from "lucide-react";
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  Class,
} from "../../../services/classService";

// ---------------- Component ----------------
const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateClass(editingId, { name, teacher });
      } else {
        await addClass({ name, teacher });
      }
      setName("");
      setTeacher("");
      setEditingId(null);
      loadData();
    } catch {
      alert("Có lỗi xảy ra khi lưu lớp học");
    }
  };

  const handleEdit = (cls: Class) => {
    setEditingId(cls.id!);
    setName(cls.name);
    setTeacher(cls.teacher || "");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa lớp này?")) {
      await deleteClass(id);
      loadData();
    }
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacher || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý lớp học</Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <Button primary onClick={() => setEditingId(0)}>
            <Plus size={18} /> Thêm lớp
          </Button>
        </div>
      </Header>

      {/* Form thêm/sửa */}
      {editingId !== null && (
        <Form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên lớp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Giảng viên"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <Button primary type="submit">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setTeacher("");
              }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      )}

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
          {filteredClasses.map((cls) => (
            <tr key={cls.id}>
              <Td>{cls.id}</Td>
              <Td>{cls.name}</Td>
              <Td>{cls.teacher || "Chưa có GV"}</Td>
              <Td>
                <Users size={16} style={{ marginRight: "6px" }} />
                {/* {cls.studentCount ?? 0} */}
              </Td>
              <Td>
                <Actions>
                  <Edit2 size={18} onClick={() => handleEdit(cls)} />
                  <Trash2 size={18} onClick={() => handleDelete(cls.id!)} />
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

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;

  input {
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
  }
`;

export default Classes;
