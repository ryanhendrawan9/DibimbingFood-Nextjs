import { useEffect } from "react";
import { useRouter } from "next/router";
import { getToken } from "../utils/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push("/foods");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Food App</h1>
        <p className="mt-4">Redirecting...</p>
      </div>
    </div>
  );
}
