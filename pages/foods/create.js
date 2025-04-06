import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodForm from "../../components/FoodForm";
import { createFood } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function CreateFood() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { getToken } = useAuth();

  const handleCreate = async (foodData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createFood(foodData);
      router.push("/foods");
    } catch (err) {
      setError(err.message || "Failed to create food. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <button
              onClick={() => router.push("/foods")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Foods
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Food
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Fill in the details to add a new food item.
              </p>
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <FoodForm onSubmit={handleCreate} buttonText="Create Food" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
