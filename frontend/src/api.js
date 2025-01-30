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
    return response;
  } catch (error) {
    console.error("Error while adding/updating journal:", error);
    throw error;
  }
};

export const fetchJournalByDate = async (date) => {
  try {
    const response = await API.get(`/journals/date?date=${date}`);
    return response.data;
  } catch (error) {
    console.log("No Journal found on the said date", error);
    throw error;
  }
};

export const getJournalEntryDates = async () => {
  try {
    const response = await API.get("/journals/journal-entry-dates");
    return response.data;
  } catch (error) {
    console.error("Error fetching journal entry dates:", error);
    throw error;
  }
};
