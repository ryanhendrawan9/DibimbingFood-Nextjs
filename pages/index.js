import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken } from "../utils/auth";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a slight delay for the animation to be visible
    const redirectTimer = setTimeout(() => {
      const token = getToken();
      if (token) {
        router.push("/foods");
      } else {
        router.push("/login");
      }
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [router]);

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
      <div className="relative z-10 flex min-h-screen justify-center items-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Dibimbing Food
          </motion.h1>

          <motion.p
            className="text-gray-200 text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover delicious recipes
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center items-center">
              <div className="h-2 w-2 bg-pink-400 rounded-full mr-1 animate-pulse"></div>
              <div
                className="h-2 w-2 bg-purple-400 rounded-full mr-1 animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className="h-2 w-2 bg-indigo-400 rounded-full animate-pulse"
                style={{ animationDelay: "600ms" }}
              ></div>
            </div>
            <p className="mt-3 text-gray-300">
              Redirecting you to tasty experiences...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
