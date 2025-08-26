import React from "react";
import styled from "styled-components";
import { Edit2, Trash2, Users, Calendar } from "lucide-react";
import { Class } from "../../../services/classService";


interface Props {
    classes: Class[];
    counts: Record<number, number>;
    selectedClassId: number | null;
    onSelect: (id: number) => void;
    onEdit: (c: Class) => void;
    onDelete: (id: number) => void;
    onOpenSchedule: (id: number) => void;
}


export const ClassTable: React.FC<Props> = ({ classes, counts, selectedClassId, onSelect, onEdit, onDelete, onOpenSchedule }) => (
    <Table>
        <thead>
            <tr>
                <Th>STT</Th><Th>ID</Th><Th>Tên lớp</Th><Th>Giảng viên</Th><Th>Số lượng SV</Th><Th>Hành động</Th>
            </tr>
        </thead>
        <tbody>
            {classes.map((cls, idx) => (
                <tr key={cls.id} onClick={() => onSelect(cls.id!)} style={{ background: selectedClassId === cls.id ? '#e5edfa' : undefined, cursor: 'pointer' }}>
                    <Td>{idx + 1}</Td>
                    <Td>{cls.id}</Td>
                    <Td>{cls.name}</Td>
                    <Td>{cls.teacher || 'Chưa có GV'}</Td>
                    <Td><Users size={16} style={{ marginRight: 6 }} />{counts[cls.id!] ?? 0}</Td>
                    <Td>
                        <Actions>
                            <Edit2 size={18} onClick={(e: any) => { e.stopPropagation(); onEdit(cls); }} />
                            <Trash2 size={18} onClick={(e: any) => { e.stopPropagation(); onDelete(cls.id!); }} />
                            <Calendar size={18} onClick={(e: any) => { e.stopPropagation(); onOpenSchedule(cls.id!); }} />
                        </Actions>
                    </Td>
                </tr>
            ))}
        </tbody>
    </Table>
);


const Table = styled.table`
width:100%; border-collapse:collapse; background:#fff; border-radius:12px; overflow:hidden; table-layout:fixed;
thead{ display:table; width:100%; table-layout:fixed; }
tbody{ display:block; max-height:400px; overflow-y:auto; width:100%; }
tr{ display:table; table-layout:fixed; width:100%; }
`;
const Th = styled.th` text-align:left; padding:12px; background:#f9fafb; font-size:14px; color:#6b7280; border-bottom:1px solid #e5e7eb; `;
const Td = styled.td` padding:12px; border-bottom:1px solid #e5e7eb; font-size:14px; `;
const Actions = styled.div` display:flex; gap:12px; svg{ cursor:pointer; color:#6b7280; &:hover{ color:#111827; } } `;


export default ClassTable;