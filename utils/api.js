import axios from "axios";

const API_URL = "https://api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "w05KkI9AWhKxzvPFtXotUva-";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    apiKey: API_KEY,
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all foods
export const getFoods = async (token) => {
  try {
    const response = await api.get("/foods", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get food by ID
export const getFoodById = async (id, token) => {
  try {
    const response = await api.get(`/foods/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new food
export const createFood = async (foodData) => {
  try {
    const response = await api.post("/create-food", foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update food
export const updateFood = async (id, foodData) => {
  try {
    const response = await api.post(`/update-food/${id}`, foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete food
export const deleteFood = async (id) => {
  try {
    const response = await api.delete(`/delete-food/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
