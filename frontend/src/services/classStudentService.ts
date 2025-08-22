import axios from "axios";

import { GET_CLASS_STUDENTS, GET_CLASS_STUDENTS_COUNT } from "../api";

export interface ClassStudent {
  id?: number;
  class_id: number;
  student_id: number;
}

// Lấy danh sách lớp
export const getClasses = async (): Promise<ClassStudent[]> => {
  const res = await axios.get(GET_CLASS_STUDENTS);
  return res.data;
};

// Thêm lớp
export const addClass = async (cls: ClassStudent): Promise<ClassStudent> => {
  const res = await axios.post(GET_CLASS_STUDENTS, cls);
  return res.data;
};

// Sửa lớp
export const updateClass = async (id: number, cls: ClassStudent): Promise<ClassStudent> => {
  const res = await axios.put(`${GET_CLASS_STUDENTS}/${id}`, cls);
  return res.data;
};

// Xóa lớp
export const deleteClass = async (id: number): Promise<{ message: string; id: number }> => {
  console.log("DELETE URL:", `${GET_CLASS_STUDENTS}/${id}`);
  const res = await axios.delete(`${GET_CLASS_STUDENTS}/${id}`);

  return res.data;
};

// Thêm API lấy số lượng sinh viên của 1 lớp
export const getClassStudentCount = async (classId: number): Promise<number> => {
    const res = await axios.get(`${GET_CLASS_STUDENTS_COUNT}/${classId}`);
    return Number(res.data?.count ?? 0);
  };
  
  export const getStudentsByClass = async (classId: number) => {
    const res = await axios.get(`${GET_CLASS_STUDENTS}/${classId}/students`);
    return res.data; // [{id, name, ...}]
  };
  
  export const deleteStudentFromClass = async (classId: number, studentId: number) => {
    await axios.delete(`${GET_CLASS_STUDENTS}/${classId}/${studentId}`);
  };