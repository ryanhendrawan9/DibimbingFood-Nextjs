import Head from "next/head";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Layout = ({
  children,
  title = "Dibimbing Food",
  description = "Food recommendation platform from Dibimbing",
  transparentNavbar = false,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar transparent={transparentNavbar} />

        {/* Add padding top to account for fixed navbar */}
        <main className="flex-grow pt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>

        <footer className="bg-[#0D0D0D] text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">
                  <span className="text-[#FF9F0D]">Dibimbing</span> Food
                </h3>
                <p className="text-sm text-gray-400">
                  Discover your favorite foods
                </p>
              </div>
              <div className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Dibimbing Food. All rights
                reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
