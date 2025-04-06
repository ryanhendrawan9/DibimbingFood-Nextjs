import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import FoodForm from "../../components/FoodForm";
import { getFoodById, updateFood, deleteFood } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export default function FoodDetail({ initialFood }) {
  const [food, setFood] = useState(initialFood);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { getToken } = useAuth();

  const handleUpdate = async (updatedFood) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateFood(id, updatedFood);
      setFood(response.data);
      setSuccess("Food updated successfully!");

      // Reload page after 1 second to show updated data
      setTimeout(() => {
        router.reload();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to update food. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this food?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteFood(id);
      router.push("/foods");
    } catch (err) {
      setError(err.message || "Failed to delete food. Please try again.");
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center py-10">
              <p className="text-gray-600">Food not found.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Food Details
              </h3>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isDeleting ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete Food"}
              </button>
            </div>

            <div className="border-t border-gray-200 p-4 sm:p-6">
              {food.imageUrl && (
                <div className="mb-6">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full max-h-96 object-contain"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <FoodForm
                initialData={food}
                onSubmit={handleUpdate}
                buttonText="Update Food"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Server-side rendering to get food details
export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // For now, let's use a default token from the assignment
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pZnRhaGZhcmhhbkBnbWFpbC5jb20iLCJ1c2VySWQiOiJjYTIzZDdjYy02Njk1LTQzNGItODE2Yy03ZTlhNWMwNGMxNjQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NjE4NzUzMjF9.wV2OECzC25qNujtyb9YHyzYIbYEV-wud3TQsYv7oB4Q";

    const response = await getFoodById(id, token);

    return {
      props: {
        initialFood: response.data || null,
      },
    };
  } catch (error) {
    console.error("Error fetching food on server:", error);

    return {
      props: {
        initialFood: null,
      },
    };
  }
}
