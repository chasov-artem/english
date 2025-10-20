import {
  ref,
  get,
  set,
  push,
  query,
  limitToFirst,
  startAfter,
  orderByKey,
} from "firebase/database";
import { database } from "./firebase";

const mapSnapshotToArray = (data) =>
  Object.keys(data).map((key) => ({ id: key, ...data[key] }));

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const testRef = ref(database);
    const snapshot = await get(testRef);
    // console.log("Database connection test:", snapshot.exists(), snapshot.val());
    return snapshot.exists();
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

// Get all teachers
export const getAllTeachers = async () => {
  try {
    // Try root path first since data is loaded there
    const teachersRef = ref(database);
    const snapshot = await get(teachersRef);
    console.log(
      "All teachers query (root):",
      snapshot.exists(),
      snapshot.val()
    );
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Check if data is directly in root or in teachers folder
      if (data.teachers) {
        return mapSnapshotToArray(data.teachers);
      } else {
        // Data is directly in root
        return mapSnapshotToArray(data);
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// Get teachers with pagination (ordered by key)
export const getTeachersPaginated = async (pageSize = 4, lastKey = null) => {
  try {
    // Use root path since data is loaded there
    let q = query(ref(database), orderByKey(), limitToFirst(pageSize));
    if (lastKey) {
      q = query(
        ref(database),
        orderByKey(),
        startAfter(lastKey),
        limitToFirst(pageSize)
      );
    }
    const snapshot = await get(q);
    // console.log("Firebase snapshot:", snapshot.exists(), snapshot.val());
    // console.log("Query path:", q.toString());
    if (snapshot.exists()) {
      const data = snapshot.val();
      const teachers = mapSnapshotToArray(data);
      const keys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
      // console.log("Teachers loaded:", teachers.length, "Keys:", keys);
      return {
        teachers,
        lastKey: keys[keys.length - 1] || null,
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
