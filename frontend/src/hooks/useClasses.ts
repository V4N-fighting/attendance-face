import { useEffect, useState, useCallback } from "react";
import { addClass, Class, deleteClass, getClasses, updateClass } from "../services/classService";
import { getClassStudentCount } from "../services/classStudentService";


export function useClasses() {
const [classes, setClasses] = useState<Class[]>([]);
const [counts, setCounts] = useState<Record<number, number>>({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);


const load = useCallback(async () => {
try {
setLoading(true);
const data = await getClasses();
setClasses(data || []);


const entries = await Promise.all(
(data || []).map(async (c) => [c.id!, await getClassStudentCount(c.id!)] as const)
);
setCounts(Object.fromEntries(entries));
setError(null);
} catch (e) {
setError("Lỗi khi tải dữ liệu lớp học");
} finally {
setLoading(false);
}
}, []);


useEffect(() => { load(); }, [load]);


const create = async (payload: { name: string; teacher?: string }) => {
await addClass(payload as any);
await load();
};
const modify = async (id: number, payload: { name: string; teacher?: string }) => {
await updateClass(id, payload as any);
await load();
};
const remove = async (id: number) => {
await deleteClass(id);
await load();
};


return { classes, counts, loading, error, load, create, modify, remove } as const;
}