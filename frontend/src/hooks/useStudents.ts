import { useState, useCallback } from "react";
import { getStudentsByClass, deleteStudentFromClass, addClass as addClassStudentMapping } from "../services/classStudentService";
import { getStudents, Student } from "../services/studentService";


export function useStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [candidates, setCandidates] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);


    const loadForClass = useCallback(async (classId: number | null) => {
        if (classId === null) return;
        try {
            setLoading(true);
            const s = await getStudentsByClass(classId);
            setStudents(s || []);
            const all = await getStudents();
            const current = new Set((s || []).map((x: any) => x.id));
            setCandidates((all || []).filter((a: any) => !current.has(a.id)));
        } catch (e) {
            setStudents([]);
            setCandidates([]);
        } finally { setLoading(false); }
    }, []);


    const removeFromClass = async (classId: number, studentId: number) => {
        await deleteStudentFromClass(classId, studentId);
        await loadForClass(classId);
    };


    const addToClass = async (classId: number, studentId: number) => {
        await addClassStudentMapping({ class_id: classId, student_id: studentId });
        await loadForClass(classId);
    };


    return { students, candidates, loading, loadForClass, removeFromClass, addToClass } as const;
}