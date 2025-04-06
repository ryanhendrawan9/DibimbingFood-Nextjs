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

  const refreshFoods = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await getFoods();
      setFoods(response.data || []);
    } catch (err) {
      setError("Failed to refresh foods");
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
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading foods...</p>
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
