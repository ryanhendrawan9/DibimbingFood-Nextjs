import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodForm from "../../components/FoodForm";
import { getFoodById, updateFood, deleteFood } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function FoodDetail({ initialFood }) {
  const [food, setFood] = useState(initialFood);
  const [isLoading, setIsLoading] = useState(!initialFood);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { getToken } = useAuth();

  useEffect(() => {
    if (!initialFood) {
      const fetchFood = async () => {
        try {
          setIsLoading(true);
          const token = getToken();
          if (!token) {
            router.push("/login");
            return;
          }
          const response = await getFoodById(id);
          setFood(response.data);
        } catch (err) {
          setError("Failed to fetch food details");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFood();
    }
  }, [id, initialFood, getToken, router]);

  const handleUpdate = async (updatedFood) => {
    try {
      setIsSubmitting(true);
      setError("");
      const token = getToken();
      const response = await updateFood(id, updatedFood);
      setFood(response.data);
      setSuccess("Food updated successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update food");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this food?")) {
      return;
    }
    try {
      setIsDeleting(true);
      const token = getToken();
      await deleteFood(id);
      router.push("/foods");
    } catch (err) {
      setError(err.message || "Failed to delete food");
    } finally {
      setIsDeleting(false);
    }
  };

  // Background image URL - consistent with other pages
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
          className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20" // Added pt-20 to fix navbar overlap
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  className="w-16 h-16 border-t-4 border-pink-300 border-solid rounded-full animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                  className="mt-4 text-pink-200 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Loading food details...
                </motion.p>
              </div>
            ) : !food ? (
              <motion.div
                className="text-center py-16 bg-black/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  className="w-24 h-24 mx-auto text-pink-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M19 14v3a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3"
                  />
                </svg>
                <motion.p
                  className="mt-4 text-xl font-medium text-pink-200"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Food not found.
                </motion.p>
              </motion.div>
            ) : (
              <>
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
                    Food Details
                  </motion.h1>
                </motion.div>

                <motion.div
                  className="bg-black/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-200">
                      {food.name}
                    </h3>
                    <motion.button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                        isDeleting
                          ? "bg-red-800/50"
                          : "bg-gradient-to-r from-red-600 to-red-800 hover:shadow-lg border border-red-500/30"
                      }`}
                      whileHover={isDeleting ? {} : { scale: 1.05 }}
                      whileTap={isDeleting ? {} : { scale: 0.95 }}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      {isDeleting ? "Deleting..." : "Delete Food"}
                    </motion.button>
                  </div>

                  <div className="p-4 sm:p-6">
                    <AnimatePresence>
                      {food.imageUrl && (
                        <motion.div
                          className="mb-6 rounded-lg overflow-hidden shadow-md border border-white/10"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="relative h-64 sm:h-96 w-full">
                            <Image
                              src={food.imageUrl}
                              alt={food.name}
                              className="object-contain"
                              fill={true}
                              sizes="(max-width: 768px) 100vw, 800px"
                              unoptimized={true}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-4 rounded-lg mb-6"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
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
                    </AnimatePresence>

                    <AnimatePresence>
                      {success && (
                        <motion.div
                          className="bg-green-900/40 border-l-4 border-green-500 text-green-100 p-4 rounded-lg mb-6"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex">
                            <div className="py-1">
                              <svg
                                className="h-6 w-6 text-green-500 mr-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold">Success</p>
                              <p className="text-sm">{success}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FoodForm
                      initialData={food}
                      onSubmit={handleUpdate}
                      buttonText={isSubmitting ? "Updating..." : "Update Food"}
                      disabled={isSubmitting}
                      darkMode={true}
                    />
                  </div>
                </motion.div>
              </>
            )}
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

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const response = await getFoodById(id);
    return {
      props: {
        initialFood: response.data || null,
      },
    };
  } catch (error) {
    return {
      props: {
        initialFood: null,
      },
    };
  }
}
