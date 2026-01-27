"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!uid || !token) {
      setStatus("error");
      setMessage("Invalid verification link. Missing parameters.");
      return;
    }

    verifyEmail(uid, token);
  }, [uid, token]);

  const verifyEmail = async (uid, token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/verify-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ uid, token }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");

        let errorMessage = "Verification failed";
        if (data.detail) {
          errorMessage =
            typeof data.detail === "string"
              ? data.detail
              : "Invalid or expired link";
        }

        setMessage(errorMessage);

        toast.error(errorMessage, {
          style: {
            background: "#dc3545",
            color: "white",
            fontSize: "15px",
            border: "none",
            borderRadius: "0",
          },
        });
        return;
      }

      setStatus("success");
      setMessage("Email verified successfully!");

      toast.success("Email verified! You can now log in.", {
        style: {
          background: "#3304a1",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");

      toast.error("Please check your network and try again", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      console.error("Verification failed:", error);
    }
  };

  return (
    <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
        <h2 className="py-6 font-semibold">VartsySMS</h2>

        <div className="text-center px-4">
          {status === "verifying" && (
            <>
              <LoaderCircle
                className="animate-spin mx-auto mb-4 text-(--custom-green) md:text-white"
                size={48}
              />
              <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
                Verifying your email...
              </h1>
              <p className="text-xs md:text-sm">Please wait a moment</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
                Email Verified!
              </h1>
              <p className="py-5 text-xs md:text-sm">{message}</p>
              <div className="bg-white md:bg-transparent p-4 rounded-md mb-4">
                <p className="text-xs md:text-sm text-black md:text-white">
                  Redirecting to login...
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
                Verification Failed
              </h1>
              <p className="py-5 text-xs md:text-sm">{message}</p>

              <div className="flex flex-col gap-2 items-center justify-center mt-4 font-medium">
                <p className="text-xs md:text-sm">
                  Already have an account?
                  <Link href="/login">
                    <span className="ml-2 text-(--custom-green) md:text-(--custom-blue-3)">
                      Go to Login
                    </span>
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
          <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
            <h2 className="py-6 font-semibold">VartsySMS</h2>
            <LoaderCircle
              className="animate-spin mx-auto mb-4 text-(--custom-green) md:text-white"
              size={48}
            />
            <p className="text-xs md:text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
