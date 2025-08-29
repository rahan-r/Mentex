import { LoginForm } from "@/components/login-form";
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("mentex");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_#5493FF,_transparent)]">
        <div className="rounded-xl bg-white it-font w-full max-w-sm mx-4 p-6 shadow-md">
          <LoginForm />
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default Auth;
