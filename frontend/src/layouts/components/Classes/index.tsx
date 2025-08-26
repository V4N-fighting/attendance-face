import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Search, Plus } from "lucide-react";
import { useClasses } from "../../../hooks/Class/useClasses";
import { useStudents } from "../../../hooks/useStudents";
import { useSchedule } from "../../../hooks/Class/useSchedule";
import Loader from "../../../Components/Loader";
import ClassForm from "./ClassForm";
import ClassTable from "./ClassTable";
import StudentPanel from "./StudentPanel";
import ScheduleModal from "./ScheduleModal";
import { useClassSessions } from "../../../hooks/Class/useClassSessions";

const Classes: React.FC = () => {
  const { classes, counts, loading, error, create, modify, remove, load } = useClasses();
  const { students, candidates, loading: studentLoading, loadForClass, removeFromClass, addToClass } = useStudents();
  const { sessions, loading: sessionsLoading, loadByClassId, add, update, remove: removeSession } = useClassSessions();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);


  const filtered = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.teacher||"").toLowerCase().includes(search.toLowerCase()));

  const selectedClassName = useMemo(() => classes.find(c => c.id === selectedClassId)?.name || '', [classes, selectedClassId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await modify(editingId, { name, teacher });
      else await create({ name, teacher });
      setEditingId(null); setName(''); setTeacher('');
    } catch (err) { alert('Có lỗi khi lưu lớp'); }
  };

  
  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  return (
    <Container>
      <Header>
        <Title>Quản lý lớp học</Title>
        <div style={{ display:'flex', gap:12 }}>
          <SearchBox>
            <Search size={18} />
            <input placeholder="Tìm lớp học..." value={search} onChange={e=>setSearch(e.target.value)} />
          </SearchBox>
          <button onClick={() => setEditingId(0)} style={{ padding:'8px 12px', borderRadius:8 }}> <Plus size={16} /> Thêm lớp</button>
        </div>
      </Header>

      {editingId !== null && (
        <ClassForm 
          editingId={editingId} 
          name={name} 
          teacher={teacher} 
          onName={setName} 
          onTeacher={setTeacher} 
          onCancel={()=>{ setEditingId(null); setName(''); setTeacher(''); }} 
          onSubmit={onSubmit} 
        />
      )}

      <ClassTable 
          classes={filtered} 
          counts={counts} 
          selectedClassId={selectedClassId} 
          onSelect={(id)=>{ setSelectedClassId(id); loadForClass(id); }} 
          onEdit={(c)=>{ setEditingId(c.id!); setName(c.name); setTeacher(c.teacher||''); }} 
          onDelete={async (id)=>
            {
              const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa lớp này?");
              if (!confirmDelete) return Promise.resolve();
            
              await remove(id);
              await load();
            }
          } 
          onOpenSchedule={ (id) => {
            setSelectedClassId(id);
            loadByClassId(id);  // load schedule theo classId
            setShowSchedule(true);
          } }
        />

      {selectedClassId && (
        <StudentPanel
          classId={selectedClassId}
          className={selectedClassName}
          students={students}
          candidates={candidates}
          loading={studentLoading}
          onRemove={async (classId, studentId) => {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?");
            if (!confirmDelete) return Promise.resolve();
          
            await removeFromClass(classId, studentId);
            await loadForClass(classId);
            await load();
          }}
          
          onAdd={async (classId, studentId) => {
            await addToClass(classId, studentId);
            await loadForClass(classId);
            await load();
          }}  
          onRefresh={() => loadForClass(selectedClassId)}
        />
      )}


        <ScheduleModal
          visible={showSchedule}
          onClose={() => setShowSchedule(false)}
          classId={selectedClassId}
          // className={selectedClassName}
          sessions={sessions}
          loading={sessionsLoading}
          onAdd={(s) => add(s)}                    // thêm
          onEdit={(s) => update(s.id!, s)}         // sửa
          onDelete={(id) => removeSession(id)}     // xóa
        />
    </Container>
  );
};

const Container = styled.div` padding: 24px; display: flex; flex-direction: column; gap: 24px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const Title = styled.h3` margin: 0; `;
const SearchBox = styled.div` display: flex; align-items: center; gap: 8px; input{ padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; } `;

export default Classes;