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

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response, // Return the response if no error
  (error) => {
    if (error.response && error.response.status === 401) {
      // Log out the user
      localStorage.removeItem("token"); // Clear the token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Pass the error along
  }
);

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

export const getJournalMetrics = async () => {
  try {
    const response = await API.get("/journals/metrics");
    return response.data;
  } catch (error) {
    console.error("Error fetching journal metrics:", error);
    throw error;
  }
};

export const getPaginatedJournal = async (skip = 0) => {
  try {
    const response = await API.get(`/journals/paginated?skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated journal:", error);
    throw error;
  }
};

export const deleteJournal = async (journalEntryDate) => {
  try {
    const response = await API.post(`/journals/deleteJournal`, {
      journalEntryDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting journal:", error);
    throw error;
  }
};
