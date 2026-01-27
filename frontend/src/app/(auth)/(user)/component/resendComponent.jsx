"use client";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

function ResendVerification({ email }) {
  const [resending, setResending] = useState(false);
  const [lastResendTime, setLastResendTime] = useState(null);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found.", {
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

    if (lastResendTime) {
      const timeSinceLastResend = Date.now() - lastResendTime;
      const fifteenMinutes = 15 * 60 * 1000;

      if (timeSinceLastResend < fifteenMinutes) {
        const timeRemaining = fifteenMinutes - timeSinceLastResend;
        const minutesRemaining = Math.floor(timeRemaining / (60 * 1000));
        const secondsRemaining = Math.ceil(
          (timeRemaining % (60 * 1000)) / 1000,
        );

        const timeMessage =
          minutesRemaining > 0
            ? `${minutesRemaining}m`
            : `${secondsRemaining}s`;

        toast.info(`Please check your email. Wait ${timeMessage} to resend.`, {
          style: {
            background: "#0066cc",
            color: "white",
            fontSize: "15px",
            border: "none",
            borderRadius: "0",
          },
          duration: 4000,
        });
        return;
      }
    }

    setResending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/resend-verification/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to resend email";
        if (data.detail && typeof data.detail === "string") {
          errorMessage = data.detail;
        }

        toast.error(errorMessage, {
          style: {
            background: "#dc3545",
            color: "white",
            fontSize: "15px",
            border: "none",
            borderRadius: "0",
          },
        });
        setResending(false);
        return;
      }

      setLastResendTime(Date.now());

      toast.success("Verification email sent! Link expires in 15 minutes.", {
        style: {
          background: "#3304a1",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
        duration: 5000,
      });
      setResending(false);
    } catch (error) {
      toast.error("Network error. Please try again.", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      setResending(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={resending}
      className="cursor-pointer  text-sm  underline "
    >
      {resending ? (
        <span className="flex items-center gap-1">
          Resending
          <LoaderCircle className="animate-spin" size={12} />
        </span>
      ) : (
        "Resend verification email"
      )}
    </button>
  );
}

export default ResendVerification;
