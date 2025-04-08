import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodForm from "../../components/FoodForm";
import { createFood } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion } from "framer-motion";

export default function CreateFood() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { getToken } = useAuth();

  const handleCreate = async (newFood) => {
    try {
      setIsSubmitting(true);
      setError("");
      const token = getToken();
      await createFood(newFood);
      router.push("/foods");
    } catch (err) {
      setError(err.message || "Failed to create food");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Background image URL - sama dengan FoodsList
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          filter: "brightness(0.3)",
        }}
      />
      {/* Gradient Overlay */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-b from-indigo-900/80 via-purple-800/70 to-pink-600/80"
        style={{ mixBlendMode: "color" }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <motion.main
          className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20" // Tambahkan pt-20 untuk ruang di bawah navbar
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            <motion.div
              className="mb-6 flex justify-between items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.button
                onClick={() => router.push("/foods")}
                className="bg-gradient-to-r from-gray-700 to-gray-900 text-gray-200 font-medium py-2 px-4 rounded-lg flex items-center shadow-md border border-gray-600/30"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
                Back to Foods
              </motion.button>

              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Create New Food
              </motion.h1>
            </motion.div>

            <motion.div
              className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-6">
                {error && (
                  <motion.div
                    className="bg-red-900/40 border-l-4 border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="h-6 w-6 text-red-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <FoodForm
                  onSubmit={handleCreate}
                  buttonText={isSubmitting ? "Creating..." : "Create Food"}
                  disabled={isSubmitting}
                  darkMode={true} // Tambahkan prop darkMode ke FoodForm untuk menyesuaikan warna form jika diperlukan
                />
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Attribution for Unsplash image */}
        <div className="fixed bottom-2 right-2 text-white/40 text-xs">
          Photo by{" "}
          <a
            href="https://unsplash.com/photos/interior-photography-of-restaurant-hrlvr2ZlUNk"
            className="underline hover:text-white/60"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jason Leung
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/"
            className="underline hover:text-white/60"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}
