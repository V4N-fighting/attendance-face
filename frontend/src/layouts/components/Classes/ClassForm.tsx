import React from "react";
import styled from "styled-components";
import Button from "../../../Components/ui/Button";


interface Props {
editingId: number | null;
name: string;
teacher: string;
onName: (v: string) => void;
onTeacher: (v: string) => void;
onCancel: () => void;
onSubmit: (e: React.FormEvent) => void;
}


export const ClassForm: React.FC<Props> = ({ editingId, name, teacher, onName, onTeacher, onCancel, onSubmit }) => (
<Form onSubmit={onSubmit}>
<input value={name} placeholder="Tên lớp" onChange={e => onName(e.target.value)} required />
<input value={teacher} placeholder="Giảng viên" onChange={e => onTeacher(e.target.value)} />
<div style={{ display: 'flex', gap: 8 }}>
<Button primary type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</Button>
<Button type="button" onClick={onCancel}>Huỷ</Button>
</div>
</Form>
);


const Form = styled.form`
display: flex;
gap: 12px;
align-items: center;
input { padding: 8px; border: 1px solid #d1d5db; border-radius: 8px; }
`;


export default ClassForm;