import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const FoodCard = ({ food }) => {
  return (
    <Link href={`/foods/${food.id}`} passHref>
      <motion.div
        className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden cursor-pointer border border-white/10"
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
          borderColor: "rgba(147, 51, 234, 0.5)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <div className="relative h-48 w-full group">
          {food.imageUrl ? (
            <>
              <Image
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                width={300}
                height={200}
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-white truncate drop-shadow-md">
              {food.name}
            </h2>
          </motion.div>
        </div>

        <div className="p-3">
          <p className="text-gray-300 text-sm line-clamp-2 h-10 overflow-hidden">
            {food.description || "No description available"}
          </p>

          {food.ingredients && food.ingredients.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {food.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full bg-purple-900/40 text-purple-200"
                >
                  {ingredient}
                </span>
              ))}
              {food.ingredients.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-300">
                  +{food.ingredients.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default FoodCard;
