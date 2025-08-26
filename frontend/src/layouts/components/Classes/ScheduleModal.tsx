import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../../Components/ui/Button";
import { ClassSession } from "../../../services/classSesstionService";
import { Edit2, Trash2 } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
  classId: number | null;
  sessions: ClassSession[];
  loading: boolean;
  onAdd?: (s: ClassSession) => void;
  onEdit?: (s: ClassSession) => void;
  onDelete?: (id: number) => void;
}

export const ScheduleModal: React.FC<Props> = ({
  visible,
  onClose,
  classId,
  sessions,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !classId) return;
  
    const startDate = new Date(editingSession.start_time);
    const endDate = new Date(editingSession.end_time);

    function formatDateLocal(date: Date) {
      // format thành "YYYY-MM-DDTHH:mm:ss"
      return date.toISOString().slice(0, 19).replace("T", " ");
    }
    
    const payload: ClassSession = {
      class_id: classId,
      topic: editingSession.topic,
      start_time: formatDateLocal(startDate), // ✅ giờ local
      end_time: formatDateLocal(endDate),
      room: editingSession.room,
    };
  
    // nếu đang sửa session mới thêm id, còn thêm mới thì không gửi id
    if (editingSession.id) {
      payload.id = editingSession.id;
      onEdit?.(payload);
    } else {
      onAdd?.(payload);
    }
  
    setEditingSession(null);
  };
  

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>Lịch học của lớp {classId}</h3>

        {editingSession ? (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Chủ đề</label>
              <input
                type="text"
                value={editingSession.topic}
                onChange={(e) =>
                  setEditingSession({ ...editingSession, topic: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Bắt đầu</label>
              <input
                type="datetime-local"
                value={editingSession.start_time.slice(0, 16)}
                onChange={(e) =>
                  setEditingSession({ ...editingSession, start_time: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Kết thúc</label>
              <input
                type="datetime-local"
                value={editingSession.end_time.slice(0, 16)}
                onChange={(e) =>
                  setEditingSession({ ...editingSession, end_time: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Phòng</label>
              <input
                type="text"
                value={editingSession.room}
                onChange={(e) =>
                  setEditingSession({ ...editingSession, room: e.target.value })
                }
                required
              />
            </FormGroup>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Button primary type="submit">Lưu</Button>
              <Button onClick={() => setEditingSession(null)}>Hủy</Button>
            </div>
          </form>
        ) : (
          <>
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Chủ đề</Th>
                    <Th>Bắt đầu</Th>
                    <Th>Kết thúc</Th>
                    <Th>Phòng</Th>
                    <Th>Hành động</Th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <Td>{s.topic}</Td>
                      <Td>{new Date(s.start_time).toLocaleString()}</Td>
                      <Td>{new Date(s.end_time).toLocaleString()}</Td>
                      <Td>{s.room}</Td>
                      <Td>
                        <Actions>
                          <Edit2
                            size={18}
                            onClick={(e: any) => {
                              e.stopPropagation();
                              setEditingSession(s);
                            }}
                          />
                          <Trash2
                            size={18}
                            onClick={(e: any) => {
                              e.stopPropagation();
                              if (
                                window.confirm("Bạn có chắc chắn muốn xóa buổi học này?")
                              ) {
                                onDelete?.(s.id!);
                              }
                            }}
                          />
                        </Actions>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Button
                primary
                onClick={() =>
                  setEditingSession({
                    class_id: classId!,
                    topic: "",
                    start_time: new Date().toISOString(),
                    end_time: new Date(new Date().getTime() + 60*60*1000).toISOString(),
                    room: "",
                  })
                }
              >
                + Thêm buổi học
              </Button>
              <Button onClick={onClose}>Đóng</Button>
            </div>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.76);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 1240px;
  min-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  thead {
    display: table;
    width: 100%;
  }
  tbody {
    display: block;
    max-height: 400px;
    overflow-y: auto;
    width: 100%;
  }
  tr {
    display: table;
    width: 100%;
    table-layout: fixed;
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
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  label {
    font-size: 14px;
    font-weight: 500;
  }

  input {
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
`;

export default ScheduleModal;
