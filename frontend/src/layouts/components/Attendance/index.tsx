import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Download, Camera, CheckCircle, XCircle, Clock } from "lucide-react";
import { ClassSession, getClassesSessionByClassId } from "../../../services/classSesstionService";
import { Class, getClasses } from "../../../services/classService";
import { getStudentsByClass } from "../../../services/classStudentService";


interface Attendance {
  student_code: string;
  name: string;
  status: "present" | "absent" | "late";
  checkIn?: string;
}


// ---------------- Component ----------------
const Attendance: React.FC = () => {
  const [students, setStudents] = useState<Attendance[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classSession, setClassSession] = useState<ClassSession[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);



  const loadClasses = async () => {
    try {
      const data = await getClasses();
      console.log("lop: ", data);
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      getStudentsByClass(selectedClassId)
        .then((data) => setStudents(data))
        .catch((err) => console.error(err));
  
      getClassesSessionByClassId(selectedClassId)
        .then((data) => setClassSession(data))
        .catch((err) => console.error(err));
    } else {
      setStudents([]);
      setClassSession([]);
    }
  }, [selectedClassId]);


  const handleStatusChange = (student_code: string, status: Attendance["status"]) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student_code === student_code
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
          <Select
            value={selectedClassId ?? ""}
            onChange={(e) => setSelectedClassId(Number(e.target.value))}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Lớp: {cls.name}
              </option>
            ))}
          </Select>

          <Select>
            <option value="">-- Chọn buổi học --</option>
            {classSession.map((session) => (
              <option key={session.id} value={session.id}>
                Buổi: {new Date(session.start_time).toLocaleString()}
              </option>
            ))}
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
            <tr key={student.student_code}>
              <Td>{student.student_code}</Td>
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
                    handleStatusChange(student.student_code, e.target.value as Attendance["status"])
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
