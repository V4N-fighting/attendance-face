import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  Student,
} from "../../../services/studentService";
import Loader from "../../../Components/Loader";

// ---------------- Component ----------------
const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Load data
  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      console.log("sinh vien: ", data);
      setStudents(data);
      setFiltered(data);
    } catch (err) {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(students);
    } else {
      setFiltered(
        students.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.student_code.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, students]);

  // Thêm / sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentCode) return;

    if (editingId) {
      await updateStudent(editingId, { name, student_code: studentCode });
    } else {
      await addStudent({ name, student_code: studentCode });
    }

    setName("");
    setStudentCode("");
    setEditingId(null);
    loadStudents();
  };

  // Xóa
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteStudent(id);
      loadStudents();
    }
  };

  // Chọn để sửa
  const handleEdit = (s: Student) => {
    setEditingId(s.id!);
    setName(s.name);
    setStudentCode(s.student_code);
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Quản lý sinh viên</Title>
        <div style={{ display: "flex", gap: "12px" }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm sinh viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBox>
        </div>
      </Header>

      {/* Form thêm / sửa */}
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên sinh viên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mã sinh viên"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />
        <Button primary type="submit">
          {editingId ? "Cập nhật" : "Thêm mới"}
        </Button>
        {editingId && (
          <Button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setStudentCode("");
            }}
          >
            Hủy
          </Button>
        )}
      </Form>

      {/* Table */}
      <Table>
        <thead>
          <tr>
            <Th>STT</Th>
            <Th>ID</Th>
            <Th>Họ và tên</Th>
            <Th>MSSV</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((student, index) => (
            <tr key={student.id}>
              <Td>{index + 1}</Td>
              <Td>{student.id}</Td>
              <Td>{student.name}</Td>
              <Td>{student.student_code}</Td>
              <Td>
                <Actions>
                  <Edit2 size={18} onClick={() => handleEdit(student)} />
                  <Trash2 size={18} onClick={() => handleDelete(student.id!)} />
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

export default Students;
