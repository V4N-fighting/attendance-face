import React, { useState } from "react";
import styled from "styled-components";
import { Download, Camera, CheckCircle, XCircle, Clock } from "lucide-react";



// ---------------- Sample Data ----------------
interface Student {
  id: number;
  name: string;
  status: "present" | "absent" | "late";
  checkIn?: string;
}

const initialStudents: Student[] = [
  { id: 1, name: "Nguyễn Văn A", status: "present", checkIn: "08:01" },
  { id: 2, name: "Trần Thị B", status: "late", checkIn: "08:15" },
  { id: 3, name: "Lê Văn C", status: "absent" },
];

// ---------------- Component ----------------
const Attendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleStatusChange = (id: number, status: Student["status"]) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, checkIn: status === "absent" ? undefined : "08:30" }
          : s
      )
    );
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Điểm danh sinh viên</Title>
        <Controls>
          <Select>
            <option>Lớp: CNTT-K16</option>
            <option>Lớp: Kinh tế-K15</option>
          </Select>
          <Select>
            <option>Buổi: 12/09/2025 - Sáng</option>
            <option>Buổi: 12/09/2025 - Chiều</option>
          </Select>
          <Button primary>
            <Camera size={18} /> Nhận diện khuôn mặt
          </Button>
          <Button>
            <Download size={18} /> Xuất báo cáo
          </Button>
        </Controls>
      </Header>

      {/* Attendance Table */}
      <Table>
        <thead>
          <tr>
            <Th>Mã SV</Th>
            <Th>Họ và tên</Th>
            <Th>Trạng thái</Th>
            <Th>Thời gian</Th>
            <Th>Điều chỉnh</Th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <Td>{student.id}</Td>
              <Td>{student.name}</Td>
              <Td>
                <StatusTag status={student.status}>
                  {student.status === "present" && <CheckCircle size={14} />}
                  {student.status === "absent" && <XCircle size={14} />}
                  {student.status === "late" && <Clock size={14} />}
                  {student.status === "present"
                    ? "Có mặt"
                    : student.status === "absent"
                    ? "Vắng"
                    : "Đi muộn"}
                </StatusTag>
              </Td>
              <Td>{student.checkIn || "-"}</Td>
              <Td>
                <Select
                  value={student.status}
                  onChange={(e) =>
                    handleStatusChange(student.id, e.target.value as Student["status"])
                  }
                >
                  <option value="present">Có mặt</option>
                  <option value="absent">Vắng</option>
                  <option value="late">Đi muộn</option>
                </Select>
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

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
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

const StatusTag = styled.span<{ status: "present" | "absent" | "late" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: ${(props) =>
    props.status === "present"
      ? "#10b981"
      : props.status === "absent"
      ? "#ef4444"
      : "#f59e0b"};
`;

export default Attendance;
