import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../utils/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const router = useRouter();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleLogout = () => {
    showNotification("Logging out successfully!");
    setTimeout(() => {
      logout();
      router.push("/login");
    }, 800);
  };

  const handleAddFood = () => {
    showNotification("Creating new food item!", "info");
  };

  return (
    <>
      {/* Custom Notification */}
      {notification && (
        <motion.div
          className={`fixed top-2 right-2 z-50 px-3 py-2 rounded shadow-md text-sm md:text-base ${
            notification.type === "success"
              ? "bg-gradient-to-r from-emerald-600 to-teal-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-700"
          } text-gray-200`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p className="font-medium">{notification.message}</p>
        </motion.div>
      )}

      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 text-gray-200 shadow-md h-12 md:h-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link href="/foods">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 font-bold text-sm sm:text-base md:text-xl">
                    Dibimbing Food
                  </span>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/foods/create">
                <motion.button
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-gray-200 text-xs sm:text-sm md:text-base font-medium py-1.5 px-2.5 md:py-2.5 md:px-4 rounded md:rounded-lg flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddFood}
                >
                  <svg
                    className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1.5 md:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Add New Food
                </motion.button>
              </Link>

              <motion.button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-gray-200 text-xs sm:text-sm md:text-base font-medium py-1.5 px-2.5 md:py-2.5 md:px-4 rounded md:rounded-lg flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1.5 md:mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
