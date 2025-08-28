import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/client";
import { CircularLoader } from "@/components/ui/loader";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;

      if (hash) {
        const urlParams = new URLSearchParams(hash.replace("#", ""));
        const access_token = urlParams.get("access_token");
        const refresh_token = urlParams.get("refresh_token");

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            console.error("Failed to set session:", sessionError.message);
            return;
          }
          const { data: userData, error: userError } =
            await supabase.auth.getUser();

          if (userError) {
            console.error("Failed to get user:", userError.message);
          } else {
            console.log("Logged in user:", userData?.user);
            localStorage.setItem("mentex", JSON.stringify(userData?.user));
          }
          window.history.replaceState(null, "", window.location.pathname);
          navigate("/");
        }
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <CircularLoader />
      <p className="lt-font text-lg text-gray-800 font-semibold text-center mt-4">
        Logging you in...
      </p>
    </div>
  );
}
