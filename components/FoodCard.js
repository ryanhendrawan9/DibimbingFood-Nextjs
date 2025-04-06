import React from "react";
import Link from "next/link";
import Image from "next/image";

const FoodCard = ({ food }) => {
  return (
    <Link href={`/foods/${food.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105">
        <div className="relative h-48 w-full">
          {food.imageUrl ? (
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {food.name}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
