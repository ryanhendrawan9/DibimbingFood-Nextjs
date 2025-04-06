import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodCard from "../../components/FoodCard";
import { getFoods } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function FoodsList({ initialFoods }) {
  const [foods, setFoods] = useState(initialFoods || []);
  const [isLoading, setIsLoading] = useState(!initialFoods);
  const [error, setError] = useState("");
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we don't have initial foods from SSR, fetch them client-side
    if (!initialFoods) {
      const fetchFoods = async () => {
        try {
          const token = getToken();
          if (!token) {
            router.push("/login");
            return;
          }

          const response = await getFoods(token);
          setFoods(response.data || []);
        } catch (err) {
          setError("Failed to fetch foods. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFoods();
    }
  }, [initialFoods, router, getToken]);

  // Force refresh function
  const refreshFoods = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await getFoods(token);
      setFoods(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to refresh foods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">All Foods</h1>
            <button
              onClick={refreshFoods}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading foods...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No foods found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Server-side rendering to get foods
export async function getServerSideProps(context) {
  try {
    // For now, let's use a default token from the assignment
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pZnRhaGZhcmhhbkBnbWFpbC5jb20iLCJ1c2VySWQiOiJjYTIzZDdjYy02Njk1LTQzNGItODE2Yy03ZTlhNWMwNGMxNjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE4NzUzMjF9.wV2OECzC25qNujtyb9YHyzYIbYEV-wud3TQsYv7oB4Q";

    const response = await getFoods(token);

    return {
      props: {
        initialFoods: response.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching foods on server:", error);

    return {
      props: {
        initialFoods: [],
      },
    };
  }
}
