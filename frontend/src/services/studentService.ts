import axios from "axios";

import { GET_STUDENTS } from "../api";

export interface Student {
  id?: number;
  name: string;
  student_code: string;
}

// Lấy danh sách sinh viên
export const getStudents = async (): Promise<Student[]> => {
  const res = await axios.get(GET_STUDENTS);
  return res.data;
};

// Thêm sinh viên
export const addStudent = async (student: Student): Promise<Student> => {
  const res = await axios.post(GET_STUDENTS, student);
  return res.data;
};

// Sửa sinh viên
export const updateStudent = async (id: number, student: Student): Promise<Student> => {
  const res = await axios.put(`${GET_STUDENTS}/${id}`, student);
  return res.data;
};

// Xóa sinh viên
export const deleteStudent = async (id: number): Promise<{ message: string; id: number }> => {
  const res = await axios.delete(`${GET_STUDENTS}/${id}`);
  return res.data;
};
