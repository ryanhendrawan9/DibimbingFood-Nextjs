import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodCard from "../../components/FoodCard";
import { getFoods } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
// Menghapus import toast dan ToastContainer
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

export default function FoodsList({ initialFoods }) {
  const [foods, setFoods] = useState(initialFoods || []);
  const [isLoading, setIsLoading] = useState(!initialFoods);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState(""); // Sebagai pengganti toast
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialFoods) {
      const fetchFoods = async () => {
        try {
          setIsLoading(true);
          const token = getToken();
          if (!token) {
            router.push("/login");
            return;
          }
          const response = await getFoods();
          setFoods(response.data || []);
        } catch (err) {
          setError("Failed to fetch foods");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFoods();
    }
  }, [initialFoods, router, getToken]);

  // Efek untuk menghilangkan pesan refresh setelah 3 detik
  useEffect(() => {
    if (refreshMessage) {
      const timer = setTimeout(() => {
        setRefreshMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [refreshMessage]);

  const refreshFoods = async () => {
    try {
      setIsRefreshing(true);
      const token = getToken();
      const response = await getFoods();
      setFoods(response.data || []);
      // Menggunakan state untuk menampilkan pesan sukses
      setRefreshMessage("Foods refreshed successfully!");
      setError(""); // Reset error jika ada
    } catch (err) {
      setError("Failed to refresh foods");
      setRefreshMessage(""); // Reset success message jika error
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Gambar background restaurant
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop";

  return (
    <>
      <Head>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Head>
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
          {/* Pengganti ToastContainer dengan custom message */}
          <AnimatePresence>
            {refreshMessage && (
              <motion.div
                className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{refreshMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Navbar />
          <motion.main
            className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-4 py-6 sm:px-0">
              <motion.div
                className="mb-6 bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20"
                whileHover={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Discover Foods
                  </motion.h1>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow">
                      {/* Search Icon */}
                      <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-white/70"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <motion.input
                        type="text"
                        placeholder="Search foods..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    <motion.button
                      onClick={refreshFoods}
                      className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg border border-white/30"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 5px 15px rgba(236, 72, 153, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading || isRefreshing}
                    >
                      {/* Refresh Icon */}
                      <svg
                        className={`h-5 w-5 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                      </svg>
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6"
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

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <motion.div
                    className="w-16 h-16 border-t-4 border-pink-300 border-solid rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.p
                    className="mt-4 text-pink-200 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Loading delicious foods...
                  </motion.p>
                </div>
              ) : filteredFoods.length === 0 ? (
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
                      d="M13 7H7v6h6V7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M13 7l3-3 4 4-3 3-4-4z"
                    />
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
                    {searchTerm
                      ? "No foods match your search."
                      : "No foods found."}
                  </motion.p>
                  <motion.p
                    className="mt-2 text-pink-100"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {searchTerm
                      ? "Try a different search term."
                      : "Add some delicious foods to get started!"}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {filteredFoods.map((food) => (
                    <motion.div key={food.id} variants={item}>
                      <FoodCard food={food} />
                    </motion.div>
                  ))}
                </motion.div>
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
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await getFoods();
    return {
      props: {
        initialFoods: response.data || [],
      },
    };
  } catch (error) {
    return {
      props: {
        initialFoods: [],
      },
    };
  }
}
