import { useEffect } from "react";
import { useRouter } from "next/router";

// Save user data to localStorage
export const saveUserData = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
  }
};

// Get user token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Get user data
export const getUserData = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Logout user
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// Auth check hook for client-side protection
export const useAuth = (redirectTo = "/login") => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token && router.pathname !== "/login") {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);

  return { getToken, getUserData, logout };
};

// For server-side auth check
export const withAuthServerSideProps = (getServerSidePropsFunc) => {
  return async (context) => {
    const { req, res } = context;
    const token = req.cookies?.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // If there's a custom getServerSideProps function, call it
    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(context, token);
    }

    // Default return
    return {
      props: { token },
    };
  };
};
