import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        await axios.get(`/api/auth/verify-email?token=${token}`);
        setMessage("Email verified successfully! 🎉");
      } catch (error) {
        setIsError(true);
        setMessage(error.response?.data?.error || "Verification failed");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {!isError && (
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{message}</h2>
          {isError && (
            <button
              onClick={() => (window.location.href = "/login")}
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
