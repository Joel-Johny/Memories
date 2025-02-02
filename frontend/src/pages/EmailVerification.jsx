import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const authToken = localStorage.getItem("token");
  if (authToken) navigate("/dashboard");
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const emailVerification = async () => {
      try {
        const token = searchParams.get("token");
        await verifyEmail(token);
        setMessage("Email verified successfully! 🎉");
      } catch (error) {
        setIsError(true);
        // console.log(error);
        setMessage(error.message);
      }
    };

    emailVerification();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{message}</h2>
          {!isError && (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
