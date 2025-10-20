import { initializeTeachersData } from "../services/teachersService";
import teachersData from "../data/teachers.json";

// Convert array to object with proper keys
const convertTeachersToObject = (teachersArray) => {
  const teachersObject = {};
  teachersArray.forEach((teacher, index) => {
    teachersObject[`teacher_${index + 1}`] = teacher;
  });
  return teachersObject;
};

export const initializeAppData = async () => {
  try {
    console.log("Initializing app data...");

    // Convert teachers array to object format for Firebase
    const teachersObject = convertTeachersToObject(teachersData);

    // Initialize teachers data in Firebase
    await initializeTeachersData(teachersObject);

    console.log("App data initialized successfully!");
  } catch (error) {
    console.error("Error initializing app data:", error);
    throw error;
  }
};
