"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!token || !uid) {
      router.push("/forgot-password");
      return;
    }

    setIsValidating(false);
  }, [token, uid, router]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      uid,
      token,
      new_password: password,
    };
    console.log(body);
    //validation first
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      setLoading(false);
      return;
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number!", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      setLoading(false);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must contain at least one special character!", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      setLoading(false);
      return;
    }
    if (password !== cpassword) {
      toast.error("Passwords do not match!", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/password/change/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Password reset error:", response.status, data);
        setIsSuccess(false);
        setLoading(false);
        toast.error("Password reset error, please try again", {
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
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      setLoading(false);
      toast.error("Please check your network and try again", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });
      console.error("Password reset failed:", error);
    }
  };

  // validate token
  if (isValidating) {
    return (
      <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
          <h2 className="py-6 font-semibold">VartsySMS</h2>
          <LoaderCircle
            className="animate-spin mx-auto mb-4 text-(--custom-green) md:text-white"
            size={48}
          />
          <p className="text-xs md:text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-(--custom-green) md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col rounded-md shadow-lg text-black md:text-white">
          <h2 className="py-6 font-semibold">VartsySMS</h2>
          <div className="text-center px-4">
            <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
              Password Changed Successfully!
            </h1>
            <p className="py-5 text-xs md:text-sm">
              Your password has been updated successfully.
              <br />
              You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button className="md:bg-white bg-(--custom-green) text-white md:text-(--custom-green) mt-4">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--custom-green) md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col rounded-md shadow-lg text-black md:text-white">
        <h2 className="py-6 font-semibold">VartsySMS</h2>
        <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl">
          Password Reset
        </h1>

        <form onSubmit={handleReset} className="w-11/12 md:w-5/12 pb-10">
          <div className="hidden md:block relative w-full mt-10">
            <input
              id="password-desktop"
              name="password"
              type={eye ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
              className="peer w-full rounded-md font-medium border border-white bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-white outline-none transition focus:border-white"
            />
            <label
              htmlFor="password-desktop"
              className="pointer-events-none absolute left-3 top-4 text-sm text-white transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-[#3304a1] px-1"
            >
              New Password
            </label>
            <button
              type="button"
              onClick={() => setEye(!eye)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
            >
              {eye ? (
                <Eye strokeWidth={1} size={18} />
              ) : (
                <EyeOff strokeWidth={1} size={18} />
              )}
            </button>
          </div>

          <div className="block md:hidden relative w-full mt-5">
            <input
              id="password-mobile"
              name="password"
              type={eye ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 pr-10 text-sm text-black outline-none transition focus:border-black"
            />
            <label
              htmlFor="password-mobile"
              className="pointer-events-none absolute left-3 top-3 text-sm text-black transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              New Password
            </label>
            <button
              type="button"
              onClick={() => setEye(!eye)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {eye ? (
                <Eye strokeWidth={1} size={18} />
              ) : (
                <EyeOff strokeWidth={1} size={18} />
              )}
            </button>
          </div>

          {/* Desktop Confirm Password Input */}
          <div className="hidden md:block relative w-full mt-4">
            <input
              id="confirm-password-desktop"
              name="confirm-password"
              type={eye2 ? "text" : "password"}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
              className="peer w-full rounded-md font-medium border border-white bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-white outline-none transition focus:border-white"
            />
            <label
              htmlFor="confirm-password-desktop"
              className="pointer-events-none absolute left-3 top-4 text-sm text-white transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-[#3304a1] px-1"
            >
              Confirm New Password
            </label>
            <button
              type="button"
              onClick={() => setEye2(!eye2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition"
            >
              {eye2 ? (
                <Eye strokeWidth={1} size={18} />
              ) : (
                <EyeOff strokeWidth={1} size={18} />
              )}
            </button>
          </div>

          {/* Mobile Confirm Password Input */}
          <div className="block md:hidden relative w-full mt-4">
            <input
              id="confirm-password-mobile"
              name="confirm-password"
              type={eye2 ? "text" : "password"}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder=" "
              required
              minLength={8}
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 pr-10 text-sm text-black outline-none transition focus:border-black"
            />
            <label
              htmlFor="confirm-password-mobile"
              className="pointer-events-none absolute left-3 top-3 text-sm text-black transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Confirm New Password
            </label>
            <button
              type="button"
              onClick={() => setEye2(!eye2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {eye2 ? (
                <Eye strokeWidth={1} size={18} />
              ) : (
                <EyeOff strokeWidth={1} size={18} />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex md:bg-white bg-(--custom-green) cursor-pointer text-white md:text-(--custom-green) items-center disabled:opacity-90 justify-center text-sm py-2 gap-2 rounded-sm   w-full mt-2 md:mt-4 "
          >
            {loading ? (
              <>
                Changing password
                <LoaderCircle
                  size={15}
                  className="animate-spin animation-duration:0.5s"
                />
              </>
            ) : (
              "Change password"
            )}
          </button>

          <div className="flex items-center justify-center mt-1 font-medium">
            <p className="text-xs md:text-sm">
              Remember your password?
              <Link href="/login">
                <span className="ml-2 text-(--custom-green) md:text-(--custom-blue-3)">
                  Back to sign in
                </span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
