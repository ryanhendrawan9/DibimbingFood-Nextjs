import axios from "axios";

const API_URL = "https://api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "w05KkI9AWhKxzvPFtXotUva-";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    apiKey: API_KEY,
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFoods = async () => {
  try {
    const response = await api.get("/foods");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFoodById = async (id) => {
  try {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createFood = async (foodData) => {
  try {
    const response = await api.post("/create-food", foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateFood = async (id, foodData) => {
  try {
    const response = await api.post(`/update-food/${id}`, foodData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteFood = async (id) => {
  try {
    const response = await api.delete(`/delete-food/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;
