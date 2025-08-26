import axios from "axios";

import { GET_CLASSES_SESSION } from "../api";

export interface ClassSession {
  id?: number;
  class_id: number;
  topic: string;
  start_time: string;
  end_time: string;
  room: string;
}
export const getClassesSession = async (): Promise<ClassSession[]> => {
  const res = await axios.get(GET_CLASSES_SESSION);
  return res.data;
};


export const addClassSession = async (cls: ClassSession): Promise<ClassSession> => {
  const res = await axios.post(GET_CLASSES_SESSION, cls);
  return res.data;
};


export const updateClassSession = async (id: number, cls: ClassSession): Promise<ClassSession> => {
  const res = await axios.put(`${GET_CLASSES_SESSION}/${id}`, cls);
  return res.data;
};


export const deleteClassSession = async (id: number): Promise<{ message: string; id: number }> => {
  console.log("DELETE URL:", `${GET_CLASSES_SESSION}/${id}`);
  const res = await axios.delete(`${GET_CLASSES_SESSION}/${id}`);

  return res.data;
};

export const getClassesSessionByClassId = async (classId: number): Promise<ClassSession[]> => {
  const res = await axios.get(`${GET_CLASSES_SESSION}/${classId}`);
  return res.data;
};
