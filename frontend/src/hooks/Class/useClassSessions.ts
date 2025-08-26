import { useState, useCallback } from "react";
import {
  ClassSession,
  getClassesSession,
  addClassSession,
  updateClassSession,
  deleteClassSession,
  getClassesSessionByClassId,
} from "../../services/classSesstionService";

export function useClassSessions() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tất cả sessions
  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClassesSession();
      setSessions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load sessions theo classId
  const loadByClassId = useCallback(async (classId: number) => {
    setLoading(true);
    try {
      const data = await getClassesSessionByClassId(classId);
      setSessions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load sessions by classId");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add session
  const add = useCallback(async (cls: ClassSession) => {
    setLoading(true);
    try {
      const newSession = await addClassSession(cls);
      setSessions((prev) => [...prev, newSession]);
    } catch (err: any) {
      setError(err.message || "Failed to add session");
    } finally {
      setLoading(false);
    }
  }, []);
  

  // Update session
  const update = useCallback(async (id: number, cls: ClassSession) => {
    setLoading(true);
    try {
      const updated = await updateClassSession(id, cls);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update session");
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete session
  const remove = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteClassSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete session");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    loadByClassId,
    add,
    update,
    remove,
  };
}
