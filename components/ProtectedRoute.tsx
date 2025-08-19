"use client";
import { useState, useEffect } from 'react';
import useAuth from "@/context/auth-context";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setChecking(false);
    }
  }, [isLoggedIn]);

  if (checking) {
    // Show a spinner or even your app layout’s shell
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
