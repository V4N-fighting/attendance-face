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
import {
  getClassStudentCount,
  getStudentsByClass,
  deleteStudentFromClass,
  addClass as addClassStudentMapping
} from "../../../services/classStudentService";
import {
  getStudents,
  Student
} from "../../../services/studentService";
import { RowBetween, SupTitle } from "../../../styled";

// ---------------- Component ----------------
const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Student modal & data state
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  // Student candidates who are not in class
  const [candidates, setCandidates] = useState<Student[]>([]);
  // --- States for add/find/filter student logic ---
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">(""); // sử dụng cho hàm cũ, giờ không còn dùng nữa
  const [studentCodeSearch, setStudentCodeSearch] = useState(""); // Lọc sinh viên trong bảng
  // Giao diện thêm sinh viên
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [studentAddInput, setStudentAddInput] = useState("");
  const [studentAddDropdown, setStudentAddDropdown] = useState(false);
  const [selectedStudentForAdd, setSelectedStudentForAdd] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getClasses();
      setClasses(data);

      // gọi count cho từng class song song
      const entries = await Promise.all(
        data.map(async (c) => {
          const cnt = await getClassStudentCount(c.id!);
          return [c.id!, cnt] as const;
        })
      );

      const map: Record<number, number> = {};
      for (const [id, cnt] of entries) map[id] = cnt;
      setCounts(map);

      setError(null);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      const data = await getStudentsByClass(selectedClassId!);
      setStudents(data);
      console.log("sinh vien: ", data);
      // gọi count cho từng class song song
      const entries = await Promise.all(
        data.map(async (c) => {
          const cnt = await getClassStudentCount(c.id!);
          return [c.id!, cnt] as const;
        })
      );

      const map: Record<number, number> = {};
      for (const [id, cnt] of entries) map[id] = cnt;
      setCounts(map);

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

  const handleDeleteClass = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa lớp học này?")) {
      await deleteClass(id);
      loadData();
    }
  };




  // Fetch students when selectedClassId changes
  useEffect(() => {
    const fetchStudentsAndCandidates = async () => {
      if (selectedClassId === null) return;
      setStudentLoading(true);
      try {
        const data = await getStudentsByClass(selectedClassId);
        setStudents(data || []);
        // Lấy toàn bộ sinh viên, loại trừ các sinh viên đã có trong lớp hiện tại
        const allStudents = await getStudents();
        const currentIds = new Set((data || []).map((s: any) => s.id));
        setCandidates(allStudents.filter((stu: any) => !currentIds.has(stu.id)));
        setSelectedStudentId("");
      } catch {
        setStudents([]);
        setCandidates([]);
      } finally {
        setStudentLoading(false);
      }
    };
    fetchStudentsAndCandidates();
  }, [selectedClassId]);

  // Handler to remove student from class
  const handleStudentDelete = async (classId: number, studentId: number) => {

    if (window.confirm("Bạn có chắc muốn xoá sinh viên này khỏi lớp?")) {
      
      await deleteStudentFromClass(classId, studentId);
      alert("Xoá sinh viên khỏi lớp thành công");

      const data = await getStudentsByClass(classId);
      setStudents(data || []);
      // Cập nhật lại candidates
      const allStudents = await getStudents();
      const currentIds = new Set((data || []).map((s: any) => s.id));
      setCandidates(allStudents.filter((stu: any) => !currentIds.has(stu.id)));
      loadData(); // cập nhật lại số lượng SV của lớp
    }
  };

  // Handler to add student to class
  const handleStudentAdd = async () => {
    if (!selectedStudentId) return;
    await addClassStudentMapping({ class_id: selectedClassId!, student_id: Number(selectedStudentId) });
    // Refresh students and candidates
    const data = await getStudentsByClass(selectedClassId!);
    setStudents(data || []);
    const allStudents = await getStudents();
    const currentIds = new Set((data || []).map((s: any) => s.id));
    setCandidates(allStudents.filter((stu: any) => !currentIds.has(stu.id)));
    setSelectedStudentId("");
    loadData();
  };

  const handleShowStudents = async (classId: number) => {
    setSelectedClassId(classId);
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacher || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  // Lấy tên lớp đang chọn
  const selectedClassName = classes.find(cls => cls.id === selectedClassId)?.name || "";

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
            <Th>STT</Th>
            <Th>ID</Th>
            <Th>Tên lớp</Th>
            <Th>Giảng viên</Th>
            <Th>Số lượng SV</Th>
            <Th>Hành động</Th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.map((cls, index) => (
            <tr
              key={cls.id}
              style={{ background: selectedClassId === cls.id ? '#e5edfa' : undefined, cursor: 'pointer' }}
              onClick={() => handleShowStudents(cls.id!)}>
              <Td>{index + 1}</Td>
              <Td>{cls.id}</Td>
              <Td>{cls.name}</Td>
              <Td>{cls.teacher || "Chưa có GV"}</Td>
              <Td>
                <Users size={16} style={{ marginRight: "6px" }} />
                {counts[cls.id!] ?? 0}
              </Td>
              <Td>
                <Actions>
                  <Edit2 size={18} onClick={e => { e.stopPropagation(); handleEdit(cls); }} />
                  <Trash2 size={18} onClick={e => { e.stopPropagation(); handleDeleteClass(cls.id!); }} />
                </Actions>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Students of selected class */}
      {selectedClassId && (
        <StudentContainer>
          <SupTitle>Danh sách sinh viên lớp {selectedClassName}</SupTitle>

          <RowBetween>
          {/* Ô tìm kiếm danh sách sinh viên trong lớp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              placeholder="Tìm sinh viên theo mã hoặc tên..."
              value={studentCodeSearch}
              onChange={e => setStudentCodeSearch(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db", minWidth: 200 }}
            />
          </div>
          <div >
                {!showAddStudentForm && (
                  <Button type="button" primary onClick={() => { setShowAddStudentForm(true); setStudentAddInput(""); setSelectedStudentForAdd(null); }}>
                    + Thêm sinh viên
                  </Button>
                )}
                {showAddStudentForm && (
                  <form
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginTop: 8, position: 'relative' }}
                    onSubmit={async e => {
                      e.preventDefault();
                      if (!selectedStudentForAdd) return;
                      await addClassStudentMapping({ class_id: selectedClassId!, student_id: selectedStudentForAdd });
                      const data = await getStudentsByClass(selectedClassId!);
                      setStudents(data || []);
                      const allStudents = await getStudents();
                      const currentIds = new Set((data || []).map((s: any) => s.id));
                      setCandidates(allStudents.filter((s: any) => !currentIds.has(s.id)));
                      setStudentAddInput("");
                      setShowAddStudentForm(false);
                      setSelectedStudentForAdd(null);
                      loadData();
                    }}
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Nhập mã/tên sinh viên để tìm..."
                      value={studentAddInput}
                      onFocus={() => setStudentAddDropdown(true)}
                      onChange={e => {
                        setStudentAddInput(e.target.value);
                        setSelectedStudentForAdd(null);
                        setStudentAddDropdown(true);
                      }}
                      style={{minWidth:240, padding:8, borderRadius:8, border:"1px solid #d1d5db"}}
                    />
                    {studentAddInput.trim() !== '' && studentAddDropdown && (
                      <div style={{
                        background: '#fff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        position: 'absolute',
                        left: 0,
                        top: '42px',
                        zIndex: 10,
                        minWidth: 240,
                        maxHeight: 180,
                        overflowY: 'auto',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                      }}>
                        {candidates
                          .filter(stu =>
                            stu.student_code.toLowerCase().includes(studentAddInput.toLowerCase()) ||
                            stu.name.toLowerCase().includes(studentAddInput.toLowerCase())
                          ).slice(0, 5)
                          .map(stu => (
                            <div
                              key={stu.id}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f3f4f6',
                                background: selectedStudentForAdd === stu.id ? "#e5edfa" : undefined
                              }}
                              onClick={() => {
                                if (stu.id !== undefined) {
                                  setSelectedStudentForAdd(stu.id);
                                }
                                setStudentAddInput(stu.student_code + ' - ' + stu.name);
                                setStudentAddDropdown(false);
                              }}
                            >
                              <strong>{stu.student_code}</strong> - {stu.name}
                            </div>
                          ))
                        }
                        {candidates.filter(stu =>
                          stu.student_code.toLowerCase().includes(studentAddInput.toLowerCase()) ||
                          stu.name.toLowerCase().includes(studentAddInput.toLowerCase())
                        ).length === 0 && (
                            <div style={{ padding: '8px 12px', color: '#888' }}>Không tìm thấy sinh viên phù hợp</div>
                          )}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <Button primary type="submit" disabled={!selectedStudentForAdd}>Thêm vào lớp</Button>
                      <Button type="button" onClick={() => { setShowAddStudentForm(false); setStudentAddInput(""); setSelectedStudentForAdd(null); }}>Huỷ</Button>
                    </div>
                  </form>
                )}
              </div>
          </RowBetween>
          {studentLoading ? (
            <p>Đang tải sinh viên...</p>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>STT</Th>
                    <Th>Mã SV</Th>
                    <Th>Họ tên</Th>
                    <Th>Hành động</Th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(stu =>
                    stu.student_code.toLowerCase().includes(studentCodeSearch.toLowerCase()) ||
                    stu.name.toLowerCase().includes(studentCodeSearch.toLowerCase())
                  ).map((stu, idx) => (
                    <tr key={stu.id}>
                      <Td>{idx + 1}</Td>
                      <Td>{stu.student_code}</Td>
                      <Td>{stu.name}</Td>
                      <Td>
                        <Actions>
                          <Trash2 size={18} onClick={() => handleStudentDelete(selectedClassId!,stu.id!)} />
                        </Actions>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
            </>
          )}
        </StudentContainer>
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

// Student styled table
const StudentContainer = styled.div`
  background: #f6f8fc;
  border-radius: 10px;
  margin-top: 32px;
  padding: 18px 20px;
`;
const StudentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export default Classes;
