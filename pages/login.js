import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { login } from "../utils/api";
import { saveUserData, getToken } from "../utils/auth";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const API_URL = "https://api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "w05KkI9AWhKxzvPFtXotUva-";

// API client untuk register
const api = axios.create({
  baseURL: API_URL,
  headers: {
    apiKey: API_KEY,
  },
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // default to login page
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman foods jika sudah login
    const token = getToken();
    if (token) {
      router.push("/foods");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(formData.email, formData.password);
      saveUserData(data);

      // Show success toast notification
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Slight delay for toast to show before redirect
      setTimeout(() => {
        router.push("/foods");
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid email or password");

      // Show error toast notification
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi password
    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match");

      // Show warning toast notification
      toast.warning("Passwords do not match!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setIsLoading(false);
      return;
    }

    try {
      // Register user
      await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordRepeat: formData.passwordRepeat,
        role: formData.role,
      });

      // Show success toast notification
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Auto login after successful registration
      try {
        const data = await login(formData.email, formData.password);
        saveUserData(data);

        // Show success toast notification for login
        toast.info("Logging you in...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Slight delay for toast to show before redirect
        setTimeout(() => {
          router.push("/foods");
        }, 2000);
      } catch (loginErr) {
        // Show info toast if auto-login fails
        toast.info("Please login with your new account credentials", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Switch to login mode
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );

      // Show error toast notification
      toast.error("Registration failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    // Show success toast notification
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Redirect to login page
    router.push("/login");
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  // Framer motion variants - FIXED
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut", // Fixed easing
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Hero Banner with Parallax Effect */}
      <motion.div
        className="bg-[#0D0D0D] text-white py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/food-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-opacity-70"></div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg tracking-wider uppercase"
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5,
                type: "spring",
                stiffness: 100,
              }}
            >
              Dibimbing Food
            </motion.h1>

            <motion.p
              className="text-white text-lg md:text-xl max-w-xl mx-auto drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Discover your favorite food recommendations right here 🍜🔥
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Auth Form Section */}
      <div className="flex-grow py-20 px-4 bg-white relative z-10">
        <motion.div
          className="max-w-md mx-auto bg-white shadow-2xl rounded-lg p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(255, 159, 13, 0.25)",
          }}
        >
          {/* Background pattern */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-50 rounded-full opacity-50"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-gray-900 mb-6 relative inline-block"
            >
              {isLogin ? "Sign In" : "Sign Up"}
              <motion.div
                className="absolute -bottom-1 left-0 h-1 bg-[#FF9F0D]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1 }}
              ></motion.div>
            </motion.h2>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="relative"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    key="name-field"
                  >
                    <div className="group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-hover:text-[#FF9F0D] transition-colors duration-200">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] focus:border-transparent transition-all duration-200 group-hover:border-[#FF9F0D]"
                        placeholder="Name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="relative" variants={fadeInUp}>
                <div className="group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-hover:text-[#FF9F0D] transition-colors duration-200">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] focus:border-transparent transition-all duration-200 group-hover:border-[#FF9F0D]"
                    placeholder="Email"
                  />
                </div>
              </motion.div>

              <motion.div className="relative" variants={fadeInUp}>
                <div className="group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-hover:text-[#FF9F0D] transition-colors duration-200">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] focus:border-transparent transition-all duration-200 group-hover:border-[#FF9F0D]"
                    placeholder="Password"
                  />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="relative"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    key="confirm-password-field"
                  >
                    <div className="group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-hover:text-[#FF9F0D] transition-colors duration-200">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        id="passwordRepeat"
                        name="passwordRepeat"
                        type="password"
                        required
                        value={formData.passwordRepeat}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] focus:border-transparent transition-all duration-200 group-hover:border-[#FF9F0D]"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex items-center" variants={fadeInUp}>
                <div
                  className="relative inline-block w-10 mr-4 align-middle select-none"
                  onClick={toggleRememberMe}
                >
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={toggleRememberMe}
                    className="absolute opacity-0 w-0 h-0"
                  />
                  <div className="block h-6 w-12 rounded-full bg-gray-200 cursor-pointer transition-colors duration-200 ease-in-out"></div>
                  <div
                    className={`absolute left-1 top-1 bg-white border-2 ${
                      rememberMe ? "border-[#FF9F0D]" : "border-gray-200"
                    } rounded-full h-4 w-4 transition-transform duration-200 ease-in-out transform ${
                      rememberMe ? "translate-x-6 bg-[#FF9F0D]" : ""
                    } cursor-pointer`}
                  ></div>
                </div>
                <label
                  htmlFor="remember-me"
                  className="block text-sm text-gray-900 cursor-pointer"
                >
                  Remember me?
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-[#FF9F0D] hover:bg-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9F0D] transition-all duration-200 transform hover:scale-[1.02]"
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLoading
                  ? isLogin
                    ? "Signing in..."
                    : "Signing up..."
                  : isLogin
                  ? "Sign In"
                  : "Sign Up"}
              </motion.button>

              {isLogin && (
                <motion.div className="text-right" variants={fadeInUp}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </motion.div>
              )}
            </motion.form>

            <motion.div className="mt-8" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <motion.span
                    className="px-6 bg-white text-gray-500"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    OR
                  </motion.span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <motion.button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-[#FF9F0D] hover:text-[#FF9F0D] transition-all duration-200"
                  whileHover={{
                    y: -2,
                    boxShadow: "0 6px 20px -5px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                  onClick={() => {
                    toast.info("Google sign-in feature coming soon!", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                  }}
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </motion.button>

                <motion.button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-[#FF9F0D] hover:text-[#FF9F0D] transition-all duration-200"
                  whileHover={{
                    y: -2,
                    boxShadow: "0 6px 20px -5px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                  onClick={() => {
                    toast.info("Apple sign-in feature coming soon!", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                  }}
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                    fill="black"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.085.988 1.424 2.156 3.021 3.733 2.943 1.496-.075 2.058-.963 3.865-.963 1.809 0 2.318.963 3.895.934 1.618-.026 2.642-1.463 3.612-2.893 1.142-1.667 1.614-3.293 1.639-3.377-.036-.013-3.132-1.206-3.193-4.779-.053-2.986 2.402-4.419 2.51-4.49-1.366-2.016-3.467-2.239-4.202-2.292-1.919-.151-3.531 1.101-4.458 1.101zm3.741-2.732c.82-.999 1.369-2.385 1.222-3.772-1.183.052-2.62.807-3.466 1.802-.76.878-1.427 2.295-1.248 3.654 1.318.079 2.679-.75 3.492-1.684z" />
                  </svg>
                  Sign up with Apple
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="mt-6 text-center" variants={itemVariants}>
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="ml-1 font-medium text-[#FF9F0D] hover:text-[#FF8C00] hover:underline transition-all duration-200"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] text-white pt-16 pb-8 relative overflow-hidden">
        {/* Background graphic elements */}
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-[#FF9F0D] opacity-5 rounded-full transform -translate-x-1/2 -translate-y-3/4"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF9F0D] opacity-5 rounded-full transform translate-y-1/2 translate-x-1/4"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-lg font-bold mb-4">About Us.</h4>
              <p className="text-sm mb-6 text-justify">
                Whether you're craving a quick bite or exploring new flavors, we
                make food ordering fast, safe, and easy anytime, anywhere.
              </p>
              <div className="flex items-start space-x-4">
                <div className="bg-[#FF9F0D] p-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Opening Hours</h5>
                  <p className="text-sm">Mon - Sun ( 08.00 - 22.00 )</p>
                </div>
              </div>
            </motion.div>

            {/* Useful Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-4">Useful Links</h4>
              <ul className="space-y-3">
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    About
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    News
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Partners
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Team
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Menu
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-4">Help?</h4>
              <ul className="space-y-3">
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Term & Condition
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Support Policy
                  </a>
                </motion.li>
                <motion.li
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-[#FF9F0D] transition-colors duration-200"
                  >
                    Privacy
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <motion.li
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 text-[#FF9F0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Jakarta, Indonesia</span>
                </motion.li>
                <motion.li
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 text-[#FF9F0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@dibimbing.id</span>
                </motion.li>
                <motion.li
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5, color: "#FF9F0D" }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 text-[#FF9F0D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+62 812-3456-7890</span>
                </motion.li>
              </ul>

              <div className="mt-6">
                <h5 className="font-medium mb-3">Follow Us</h5>
                <div className="flex space-x-3">
                  <motion.a
                    href="#"
                    className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                    whileHover={{
                      y: -3,
                      backgroundColor: "#FF9F0D",
                      color: "#FFFFFF",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                    whileHover={{
                      y: -3,
                      backgroundColor: "#FF9F0D",
                      color: "#FFFFFF",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                    whileHover={{
                      y: -3,
                      backgroundColor: "#FF9F0D",
                      color: "#FFFFFF",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm mb-4 md:mb-0">
              Copyright © {new Date().getFullYear()} by LaVine. All Rights
              Reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <motion.a
                href="#"
                className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                whileHover={{
                  y: -3,
                  backgroundColor: "#FF9F0D",
                  color: "#FFFFFF",
                }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                whileHover={{
                  y: -3,
                  backgroundColor: "#FF9F0D",
                  color: "#FFFFFF",
                }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="bg-[#FF9F0D] text-black h-8 w-8 flex items-center justify-center rounded-sm hover:text-[#FF9F0D] transition-colors duration-200"
                whileHover={{
                  y: -3,
                  backgroundColor: "#FF9F0D",
                  color: "#FFFFFF",
                }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
