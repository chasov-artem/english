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

    if (snapshot.exists()) {
      const data = snapshot.val();
      const teachers = mapSnapshotToArray(data);
      const keys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));

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

// Filter teachers by criteria
export const filterTeachers = (teachers, filters) => {
  return teachers.filter((teacher) => {
    // Filter by languages
    if (filters.languages.length > 0) {
      const hasMatchingLanguage = filters.languages.some(
        (lang) => teacher.languages && teacher.languages.includes(lang)
      );
      if (!hasMatchingLanguage) return false;
    }

    // Filter by levels
    if (filters.levels.length > 0) {
      const hasMatchingLevel = filters.levels.some(
        (level) => teacher.levels && teacher.levels.includes(level)
      );
      if (!hasMatchingLevel) return false;
    }

    // Filter by price
    if (filters.priceRange !== "all") {
      const price = teacher.price_per_hour;
      switch (filters.priceRange) {
        case "0-20":
          if (price >= 20) return false;
          break;
        case "20-30":
          if (price < 20 || price > 30) return false;
          break;
        case "30+":
          if (price <= 30) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });
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
