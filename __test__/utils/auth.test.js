// __tests__/utils/auth.test.js
import {
  saveUserData,
  getToken,
  getUserData,
  logout,
  useAuth,
  withAuthServerSideProps,
} from "../../utils/auth";
import { render, renderHook } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock window object
const originalWindow = global.window;
beforeAll(() => {
  Object.defineProperty(global, "window", {
    value: { localStorage: localStorageMock },
    writable: true,
  });
});

afterAll(() => {
  global.window = originalWindow;
});

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

  test("saveUserData does nothing when window is undefined", () => {
    const originalWindow = global.window;
    global.window = undefined;

    const userData = {
      token: "test-token",
      user: { id: 1, name: "Test User" },
    };
    saveUserData(userData);

    expect(localStorage.setItem).not.toHaveBeenCalled();

    global.window = originalWindow;
  });

  test("getToken retrieves token from localStorage", () => {
    localStorage.getItem.mockReturnValueOnce("test-token");

    const token = getToken();

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(token).toBe("test-token");
  });

  test("getToken returns null when window is undefined", () => {
    const originalWindow = global.window;
    global.window = undefined;

    const token = getToken();

    expect(token).toBeNull();
    expect(localStorage.getItem).not.toHaveBeenCalled();

    global.window = originalWindow;
  });

  test("getUserData retrieves and parses user data from localStorage", () => {
    const mockUser = { id: 1, name: "Test User" };
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    const user = getUserData();

    expect(localStorage.getItem).toHaveBeenCalledWith("user");
    expect(user).toEqual(mockUser);
  });

  test("getUserData returns null when user data is not in localStorage", () => {
    localStorage.getItem.mockReturnValueOnce(null);

    const user = getUserData();

    expect(localStorage.getItem).toHaveBeenCalledWith("user");
    expect(user).toBeNull();
  });

  test("getUserData returns null when window is undefined", () => {
    const originalWindow = global.window;
    global.window = undefined;

    const user = getUserData();

    expect(user).toBeNull();
    expect(localStorage.getItem).not.toHaveBeenCalled();

    global.window = originalWindow;
  });

  test("logout removes user data from localStorage", () => {
    logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test("logout does nothing when window is undefined", () => {
    const originalWindow = global.window;
    global.window = undefined;

    logout();

    expect(localStorage.removeItem).not.toHaveBeenCalled();

    global.window = originalWindow;
  });

  describe("useAuth hook", () => {
    test("redirects to login if no token is present", () => {
      const pushMock = jest.fn();
      useRouter.mockReturnValue({
        push: pushMock,
        pathname: "/dashboard",
      });

      localStorage.getItem.mockReturnValueOnce(null); // No token

      renderHook(() => useAuth());

      expect(localStorage.getItem).toHaveBeenCalledWith("token");
      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    test("does not redirect if token is present", () => {
      const pushMock = jest.fn();
      useRouter.mockReturnValue({
        push: pushMock,
        pathname: "/dashboard",
      });

      localStorage.getItem.mockReturnValueOnce("valid-token"); // Valid token

      renderHook(() => useAuth());

      expect(localStorage.getItem).toHaveBeenCalledWith("token");
      expect(pushMock).not.toHaveBeenCalled();
    });

    test("does not redirect if already on login page", () => {
      const pushMock = jest.fn();
      useRouter.mockReturnValue({
        push: pushMock,
        pathname: "/login",
      });

      localStorage.getItem.mockReturnValueOnce(null); // No token

      renderHook(() => useAuth());

      expect(pushMock).not.toHaveBeenCalled();
    });

    test("uses custom redirect path when provided", () => {
      const pushMock = jest.fn();
      useRouter.mockReturnValue({
        push: pushMock,
        pathname: "/dashboard",
      });

      localStorage.getItem.mockReturnValueOnce(null); // No token

      renderHook(() => useAuth("/custom-login"));

      expect(pushMock).toHaveBeenCalledWith("/custom-login");
    });

    test("returns auth utilities", () => {
      useRouter.mockReturnValue({
        push: jest.fn(),
        pathname: "/dashboard",
      });

      localStorage.getItem.mockReturnValueOnce("valid-token");

      const { result } = renderHook(() => useAuth());

      expect(result.current).toHaveProperty("getToken");
      expect(result.current).toHaveProperty("getUserData");
      expect(result.current).toHaveProperty("logout");
    });
  });

  describe("withAuthServerSideProps", () => {
    test("redirects if no token found in cookies", async () => {
      const context = {
        req: { cookies: {} },
        res: {},
      };

      const result = await withAuthServerSideProps()(context);

      expect(result).toEqual({
        redirect: {
          destination: "/login",
          permanent: false,
        },
      });
    });

    test("calls custom getServerSideProps function if token exists", async () => {
      const mockGetServerSideProps = jest.fn().mockResolvedValue({
        props: { customData: "test" },
      });

      const context = {
        req: { cookies: { token: "valid-token" } },
        res: {},
      };

      const result = await withAuthServerSideProps(mockGetServerSideProps)(
        context
      );

      expect(mockGetServerSideProps).toHaveBeenCalledWith(
        context,
        "valid-token"
      );
      expect(result).toEqual({
        props: { customData: "test" },
      });
    });

    test("returns default props if no custom function and token exists", async () => {
      const context = {
        req: { cookies: { token: "valid-token" } },
        res: {},
      };

      const result = await withAuthServerSideProps()(context);

      expect(result).toEqual({
        props: { token: "valid-token" },
      });
    });
  });
});
