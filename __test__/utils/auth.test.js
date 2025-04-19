// __tests__/utils/auth.test.js
import { saveUserData, getToken, getUserData, logout } from "../../utils/auth";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Auth Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("saveUserData stores user data in localStorage", () => {
    const userData = {
      token: "test-token",
      user: { id: 1, name: "Test User" },
    };
    saveUserData(userData);

    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(userData.user)
    );
  });

  test("getToken retrieves token from localStorage", () => {
    localStorage.getItem.mockReturnValueOnce("test-token");

    const token = getToken();

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(token).toBe("test-token");
  });

  test("getUserData retrieves and parses user data from localStorage", () => {
    const mockUser = { id: 1, name: "Test User" };
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    const user = getUserData();

    expect(localStorage.getItem).toHaveBeenCalledWith("user");
    expect(user).toEqual(mockUser);
  });

  test("logout removes user data from localStorage", () => {
    logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});
