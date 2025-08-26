import { useState, useCallback } from "react";
import { ClassSession, getClassesSessionByClassId } from "../services/classSesstionService";


export function useSchedule() {
const [sessions, setSessions] = useState<ClassSession[]>([]);
const [loading, setLoading] = useState(false);


const load = useCallback(async (classId: number | null) => {
if (classId == null) return;
try {
setLoading(true);
const data = await getClassesSessionByClassId(classId);
setSessions(data || []);
} catch (e) {
setSessions([]);
} finally { setLoading(false); }
}, []);


return { sessions, loading, load } as const;
}