import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../pages/login";
import { login } from "../../utils/api";
import { saveUserData, getToken } from "../../utils/auth";
import { toast } from "react-toastify";
import axios from "axios";

// Mock modules
jest.mock("../../utils/api", () => ({
  login: jest.fn(),
}));

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
    },
  })),
}));

jest.mock("../../utils/auth", () => ({
  saveUserData: jest.fn(),
  getToken: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock next/router
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {children}
      </a>
    );
  };
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} data-testid="next-image" />,
}));

// Mock all framer-motion components
jest.mock("framer-motion", () => {
  const ActualReact = jest.requireActual("react");
  return {
    __esModule: true,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      span: ({ children, ...props }) => <span {...props}>{children}</span>,
      button: ({ children, ...props }) => (
        <button {...props}>{children}</button>
      ),
      form: ({ children, ...props }) => <form {...props}>{children}</form>,
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
      h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
      h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
      h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
      p: ({ children, ...props }) => <p {...props}>{children}</p>,
      a: ({ children, ...props }) => <a {...props}>{children}</a>,
      input: (props) => <input {...props} />,
      footer: ({ children, ...props }) => (
        <footer {...props}>{children}</footer>
      ),
      nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
      ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
      li: ({ children, ...props }) => <li {...props}>{children}</li>,
      label: ({ children, ...props }) => <label {...props}>{children}</label>,
      section: ({ children, ...props }) => (
        <section {...props}>{children}</section>
      ),
      header: ({ children, ...props }) => (
        <header {...props}>{children}</header>
      ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
    useAnimation: () => ({ start: jest.fn() }),
    useMotionValue: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      onChange: jest.fn(),
    })),
    useTransform: jest.fn(() => ActualReact.useState(0)[0]),
    whileHover: jest.fn(),
    whileTap: jest.fn(),
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Default to no token for most tests
    getToken.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders login form", () => {
    render(<Login />);

    // Check main elements
    expect(screen.getByText("Dibimbing Food")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  it("redirects to /foods if already logged in", () => {
    // Mock having a token
    getToken.mockReturnValue("existing-token");

    render(<Login />);

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("toggles between login and register forms", () => {
    render(<Login />);

    // Initially on login form
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();

    // Click to switch to register
    fireEvent.click(screen.getByText(/Don't have an account\?/i).nextSibling);

    // Now on register form
    expect(
      screen.getByRole("button", { name: /Sign Up/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();

    // Switch back to login
    fireEvent.click(screen.getByText(/Already have an account\?/i).nextSibling);

    // Back on login form
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();
  });

  it("handles login form submission success", async () => {
    const mockUserData = {
      token: "test-token",
      user: { id: 1, name: "Test User" },
    };
    login.mockResolvedValueOnce(mockUserData);

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Toggle remember me
    fireEvent.click(screen.getByText("Remember me?"));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(login).toHaveBeenCalledWith("test@example.com", "password123");

    await waitFor(() => {
      expect(saveUserData).toHaveBeenCalledWith(mockUserData);
      expect(toast.success).toHaveBeenCalled();
    });

    // Fast-forward timer to trigger redirect
    jest.advanceTimersByTime(1000);

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("handles login form submission error", async () => {
    login.mockRejectedValueOnce({ message: "Invalid credentials" });

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong-password" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("handles registration form submission with mismatched passwords", async () => {
    render(<Login />);

    // Switch to register form
    fireEvent.click(screen.getByText(/Don't have an account\?/i).nextSibling);

    // Fill the form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password456" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      expect(toast.warning).toHaveBeenCalled();
    });
  });

  it("handles registration form submission success", async () => {
    // Mock axios for register API
    axios.create().post.mockResolvedValueOnce({
      data: { message: "User registered successfully" },
    });

    // Mock login call after registration
    login.mockResolvedValueOnce({ token: "new-token", user: { id: 2 } });

    render(<Login />);

    // Switch to register form
    fireEvent.click(screen.getByText(/Don't have an account\?/i).nextSibling);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "New User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.create().post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });

    // Check if login was called after successful registration
    expect(login).toHaveBeenCalled();

    // Fast-forward timer for the redirect
    jest.advanceTimersByTime(2000);

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("handles registration error", async () => {
    // Mock axios post to throw error
    axios.create().post.mockRejectedValueOnce({
      response: { data: { message: "Email already exists" } },
    });

    render(<Login />);

    // Switch to register form
    fireEvent.click(screen.getByText(/Don't have an account\?/i).nextSibling);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "New User" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "existing@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("handles social login buttons", () => {
    render(<Login />);

    // Click Google sign-in button
    fireEvent.click(screen.getByText("Sign up with Google"));
    expect(toast.info).toHaveBeenCalledWith(
      "Google sign-in feature coming soon!",
      expect.anything()
    );

    // Click Apple sign-in button
    fireEvent.click(screen.getByText("Sign up with Apple"));
    expect(toast.info).toHaveBeenCalledWith(
      "Apple sign-in feature coming soon!",
      expect.anything()
    );
  });
});
