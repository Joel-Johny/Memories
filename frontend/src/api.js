import axios from "axios";

// Define the API endpoint
const backendURL = `${import.meta.env.VITE_BACKEND_URL}/api`;
const API = axios.create({ baseURL: backendURL });

// Add token to request header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Function to handle adding or updating a journal
export const addOrUpdateJournal = async (formData) => {
  try {
    const response = await API.post("/journals/addOrUpdate", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the backend knows it's a form data request
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding/updating journal:", error);
    throw error;
  }
};
