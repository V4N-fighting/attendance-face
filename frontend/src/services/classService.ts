import axios from "axios";

import { GET_CLASSES } from "../api";

export interface Class {
  id?: number;
  name: string;
  teacher?: string;
}

// Lấy danh sách lớp
export const getClasses = async (): Promise<Class[]> => {
  const res = await axios.get(GET_CLASSES);
  return res.data;
};

// Thêm lớp
export const addClass = async (cls: Class): Promise<Class> => {
  const res = await axios.post(GET_CLASSES, cls);
  return res.data;
};

// Sửa lớp
export const updateClass = async (id: number, cls: Class): Promise<Class> => {
  const res = await axios.put(`${GET_CLASSES}/${id}`, cls);
  return res.data;
};

// Xóa lớp
export const deleteClass = async (id: number): Promise<{ message: string; id: number }> => {
  const res = await axios.delete(`${GET_CLASSES}/${id}`);

  return res.data;
};
