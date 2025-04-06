import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../utils/auth";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/foods">
              <span className="flex-shrink-0 cursor-pointer">
                <h1 className="text-xl font-bold">Dibimbing Food</h1>
              </span>
            </Link>
          </div>
          <div className="flex">
            <Link href="/foods/create">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4">
                Add New Food
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
