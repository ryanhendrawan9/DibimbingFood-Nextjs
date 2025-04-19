import axios from "axios";
import {
  login,
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../../utils/api";

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn((callback) => callback({ headers: {} })),
      },
    },
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe("API Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should call API with correct parameters and return data", async () => {
      const mockResponse = { data: { token: "test-token", user: { id: 1 } } };
      axios.create().post.mockResolvedValueOnce(mockResponse);

      const result = await login("test@example.com", "password");

      expect(axios.create().post).toHaveBeenCalledWith("/login", {
        email: "test@example.com",
        password: "password",
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when API call fails", async () => {
      const mockError = {
        response: { data: { message: "Invalid credentials" } },
      };
      axios.create().post.mockRejectedValueOnce(mockError);

      await expect(login("test@example.com", "wrong-password")).rejects.toEqual(
        mockError.response.data
      );
    });
  });

  describe("getFoods", () => {
    it("should call API and return data", async () => {
      const mockResponse = { data: { data: [{ id: 1, name: "Food 1" }] } };
      axios.create().get.mockResolvedValueOnce(mockResponse);

      const result = await getFoods();

      expect(axios.create().get).toHaveBeenCalledWith("/foods");
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getFoodById", () => {
    it("should call API with food ID and return data", async () => {
      const mockResponse = { data: { data: { id: 1, name: "Food 1" } } };
      axios.create().get.mockResolvedValueOnce(mockResponse);

      const result = await getFoodById(1);

      expect(axios.create().get).toHaveBeenCalledWith("/foods/1");
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createFood", () => {
    it("should call API with food data and return response", async () => {
      const mockFoodData = { name: "New Food", description: "Description" };
      const mockResponse = { data: { message: "Food created successfully" } };
      axios.create().post.mockResolvedValueOnce(mockResponse);

      const result = await createFood(mockFoodData);

      expect(axios.create().post).toHaveBeenCalledWith(
        "/create-food",
        mockFoodData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateFood", () => {
    it("should call API with food ID and data", async () => {
      const mockFoodData = { name: "Updated Food" };
      const mockResponse = { data: { message: "Food updated successfully" } };
      axios.create().post.mockResolvedValueOnce(mockResponse);

      const result = await updateFood(1, mockFoodData);

      expect(axios.create().post).toHaveBeenCalledWith(
        "/update-food/1",
        mockFoodData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("deleteFood", () => {
    it("should call API with food ID", async () => {
      const mockResponse = { data: { message: "Food deleted successfully" } };
      axios.create().delete.mockResolvedValueOnce(mockResponse);

      const result = await deleteFood(1);

      expect(axios.create().delete).toHaveBeenCalledWith("/delete-food/1");
      expect(result).toEqual(mockResponse.data);
    });
  });
});
