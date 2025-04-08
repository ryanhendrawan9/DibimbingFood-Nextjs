import React, { useState } from "react";
import { motion } from "framer-motion";

const FoodForm = ({
  initialData,
  onSubmit,
  buttonText = "Submit",
  disabled = false,
  darkMode = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    ingredients: initialData?.ingredients?.join(", ") || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Process ingredients from comma-separated string to array
      const processedData = {
        ...formData,
        ingredients: formData.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      await onSubmit(processedData);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Menyesuaikan style berdasarkan prop darkMode
  const labelClass = darkMode
    ? "block text-sm font-medium text-gray-200"
    : "block text-sm font-medium text-gray-700";

  const inputClass = darkMode
    ? "mt-1 block w-full px-3 py-2 bg-gray-800/70 border border-gray-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
    : "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  const errorClass = darkMode
    ? "bg-red-900/40 border border-red-500 text-red-100 px-4 py-3 rounded"
    : "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";

  const formClass = darkMode
    ? "space-y-6 p-6 rounded-lg"
    : "space-y-6 bg-white p-6 rounded-lg shadow-md";

  const buttonClass = darkMode
    ? `px-4 py-2 rounded-md text-white font-medium ${
        isLoading || disabled
          ? "bg-purple-800/50"
          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
      }`
    : `px-4 py-2 rounded-md text-white font-medium ${
        isLoading || disabled
          ? "bg-indigo-300"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={formClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {error && (
        <motion.div
          className={errorClass}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Food Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Enter food name"
          disabled={isLoading || disabled}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className={inputClass}
          placeholder="Describe this food"
          disabled={isLoading || disabled}
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="https://example.com/image.jpg"
          disabled={isLoading || disabled}
        />
      </div>

      <div>
        <label htmlFor="ingredients" className={labelClass}>
          Ingredients (comma-separated)
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
          rows={3}
          className={inputClass}
          placeholder="Rice, chicken, garlic, olive oil, ..."
          disabled={isLoading || disabled}
        />
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading || disabled}
          className={buttonClass}
          whileHover={isLoading || disabled ? {} : { scale: 1.03 }}
          whileTap={isLoading || disabled ? {} : { scale: 0.98 }}
        >
          {isLoading ? "Processing..." : buttonText}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default FoodForm;
