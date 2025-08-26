import React from "react";
import styled from "styled-components";
import Button from "../../../Components/ui/Button";
import { ClassSession } from "../../../services/classSesstionService";
import { Edit2, Trash2 } from "lucide-react";

interface Props { visible:boolean; onClose:()=>void; classId:number | null; sessions:ClassSession[]; loading:boolean; onAdd?:()=>void; onEdit?: (s:ClassSession)=>void; onDelete?: (id:number)=>void }

export const ScheduleModal: React.FC<Props> = ({ visible, onClose, classId, sessions, loading, onAdd, onEdit, onDelete }) => {
  if (!visible) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e=>e.stopPropagation()}>
        <h3>Lịch học của lớp {classId}</h3>
        {loading ? <p>Đang tải...</p> : (
          <Table>
            <thead><tr><Th>Chủ đề</Th><Th>Bắt đầu</Th><Th>Kết thúc</Th><Th>Phòng</Th><Th>Hành động</Th></tr></thead>
            <tbody>
              {sessions.map(s=> (
                <tr key={s.id}><Td>{s.topic}</Td><Td>{new Date(s.start_time).toLocaleString()}</Td><Td>{new Date(s.end_time).toLocaleString()}</Td><Td>{s.room}</Td><Td><Edit2 size={16} onClick={()=>onEdit?.(s)} /><Trash2 size={16} onClick={()=>onDelete?.(s.id!)} /></Td></tr>
              ))}
            </tbody>
          </Table>
        )}
        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <Button primary onClick={onAdd}>+ Thêm buổi học</Button>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div` position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:1000; `;
const ModalContent = styled.div` background:white; padding:24px; border-radius:12px; min-width:600px; max-height:80vh; overflow-y:auto; `;
const Table = styled.table` width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; thead{ display:table; width:100%; } tbody{ display:block; max-height:400px; overflow-y:auto; width:100%; } tr{ display:table; width:100%; table-layout:fixed; } `;
const Th = styled.th` text-align:left; padding:12px; background:#f9fafb; font-size:14px; color:#6b7280; border-bottom:1px solid #e5e7eb; `;
const Td = styled.td` padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; `;

export default ScheduleModal;