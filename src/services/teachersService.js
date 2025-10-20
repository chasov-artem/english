import {
  ref,
  get,
  set,
  push,
  query,
  limitToFirst,
  startAfter,
} from "firebase/database";
import { database } from "./firebase";

// Get all teachers
export const getAllTeachers = async () => {
  try {
    const teachersRef = ref(database, "teachers");
    const snapshot = await get(teachersRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// Get teachers with pagination
export const getTeachersPaginated = async (pageSize = 4, lastKey = null) => {
  try {
    let teachersRef = ref(database, "teachers");

    if (lastKey) {
      teachersRef = query(
        teachersRef,
        startAfter(lastKey),
        limitToFirst(pageSize)
      );
    } else {
      teachersRef = query(teachersRef, limitToFirst(pageSize));
    }

    const snapshot = await get(teachersRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const teachers = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      return {
        teachers,
        lastKey: Object.keys(data)[Object.keys(data).length - 1],
      };
    }

    return { teachers: [], lastKey: null };
  } catch (error) {
    console.error("Error fetching paginated teachers:", error);
    throw error;
  }
};

// Add teacher to database
export const addTeacher = async (teacherData) => {
  try {
    const teachersRef = ref(database, "teachers");
    const newTeacherRef = push(teachersRef);
    await set(newTeacherRef, teacherData);
    return newTeacherRef.key;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};

// Initialize teachers data from JSON
export const initializeTeachersData = async (teachersData) => {
  try {
    const teachersRef = ref(database, "teachers");
    await set(teachersRef, teachersData);
    console.log("Teachers data initialized successfully");
  } catch (error) {
    console.error("Error initializing teachers data:", error);
    throw error;
  }
};
