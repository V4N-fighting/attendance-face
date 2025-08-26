import React, { useState } from "react";
import styled from "styled-components";
import { Trash2 } from "lucide-react";
import { RowBetween, SupTitle } from "../../../styled";
import Button from "../../../Components/ui/Button";
import { Student } from "../../../services/studentService";
import { addClass as addClassStudentMapping } from "../../../services/classStudentService";

interface Props {
    classId: number;
    className: string;
    students: Student[];
    candidates: Student[];
    loading: boolean;
    onRemove: (classId: number, studentId: number) => Promise<void>;
    onAdd: (classId: number, studentId: number) => Promise<void>;
    onRefresh: () => Promise<void>;
}

const StudentPanel: React.FC<Props> = ({
  classId,
  className,
  students,
  candidates,
  loading,
  onRemove,
  onAdd,
  onRefresh,
}) => {
  const [studentCodeSearch, setStudentCodeSearch] = useState("");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [studentAddInput, setStudentAddInput] = useState("");
  const [studentAddDropdown, setStudentAddDropdown] = useState(false);
  const [selectedStudentForAdd, setSelectedStudentForAdd] = useState<number | null>(null);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAdd) return;

    await onAdd(classId, selectedStudentForAdd);

    onRefresh();

    setStudentAddInput("");
    setShowAddStudentForm(false);
    setSelectedStudentForAdd(null);
    onRefresh();
  };

  return (
    <StudentContainer>
      <SupTitle>Danh sách sinh viên lớp {className}</SupTitle>

      <RowBetween>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            placeholder="Tìm sinh viên theo mã hoặc tên..."
            value={studentCodeSearch}
            onChange={(e) => setStudentCodeSearch(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              minWidth: 200,
            }}
          />
        </div>
        <div>
          {!showAddStudentForm && (
            <Button
              type="button"
              primary
              onClick={() => {
                setShowAddStudentForm(true);
                setStudentAddInput("");
                setSelectedStudentForAdd(null);
              }}
            >
              + Thêm sinh viên
            </Button>
          )}
          {showAddStudentForm && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 8,
                position: "relative",
              }}
              onSubmit={handleAddStudent}
            >
              <input
                autoFocus
                type="text"
                placeholder="Nhập mã/tên sinh viên để tìm..."
                value={studentAddInput}
                onFocus={() => setStudentAddDropdown(true)}
                onChange={(e) => {
                  setStudentAddInput(e.target.value);
                  setSelectedStudentForAdd(null);
                  setStudentAddDropdown(true);
                }}
                style={{
                  minWidth: 240,
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                }}
              />
              {studentAddInput.trim() !== "" && studentAddDropdown && (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    position: "absolute",
                    left: 0,
                    top: "42px",
                    zIndex: 10,
                    minWidth: 240,
                    maxHeight: 180,
                    overflowY: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  }}
                >
                  {candidates
                    .filter(
                      (stu) =>
                        stu.student_code
                          .toLowerCase()
                          .includes(studentAddInput.toLowerCase()) ||
                        stu.name
                          .toLowerCase()
                          .includes(studentAddInput.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((stu) => (
                      <div
                        key={stu.id}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f3f4f6",
                          background:
                            selectedStudentForAdd === stu.id
                              ? "#e5edfa"
                              : undefined,
                        }}
                        onClick={() => {
                          if (stu.id !== undefined) {
                            setSelectedStudentForAdd(stu.id);
                          }
                          setStudentAddInput(
                            stu.student_code + " - " + stu.name
                          );
                          setStudentAddDropdown(false);
                        }}
                      >
                        <strong>{stu.student_code}</strong> - {stu.name}
                      </div>
                    ))}
                  {candidates.filter(
                    (stu) =>
                      stu.student_code
                        .toLowerCase()
                        .includes(studentAddInput.toLowerCase()) ||
                      stu.name
                        .toLowerCase()
                        .includes(studentAddInput.toLowerCase())
                  ).length === 0 && (
                    <div style={{ padding: "8px 12px", color: "#888" }}>
                      Không tìm thấy sinh viên phù hợp
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Button primary type="submit" disabled={!selectedStudentForAdd}>
                  Thêm vào lớp
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddStudentForm(false);
                    setStudentAddInput("");
                    setSelectedStudentForAdd(null);
                  }}
                >
                  Huỷ
                </Button>
              </div>
            </form>
          )}
        </div>
      </RowBetween>

      {loading ? (
        <p>Đang tải sinh viên...</p>
      ) : (
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
            {students
              .filter(
                (stu) =>
                  stu.student_code
                    .toLowerCase()
                    .includes(studentCodeSearch.toLowerCase()) ||
                  stu.name
                    .toLowerCase()
                    .includes(studentCodeSearch.toLowerCase())
              )
              .map((stu, idx) => (
                <tr key={stu.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{stu.student_code}</Td>
                  <Td>{stu.name}</Td>
                  <Td>
                    <Actions>
                      <Trash2
                        size={18}
                        onClick={() => onRemove(classId, stu.id!)}
                      />
                    </Actions>
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </StudentContainer>
  );
};

export default StudentPanel;

// ---------------- Styled ----------------
const StudentContainer = styled.div`
  background: #f6f8fc;
  border-radius: 10px;
  margin-top: 32px;
  padding: 18px 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
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
