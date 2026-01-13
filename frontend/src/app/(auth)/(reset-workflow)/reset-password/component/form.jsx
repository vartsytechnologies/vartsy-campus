"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");

  // Check for token on component mount
  useEffect(() => {
    if (!token) {
      // No token provided - redirect to forgot password
      router.push("/forgot-password");
      return;
    }

    // Optional: Verify token with backend
    // Uncomment and implement when your API is ready
    /*
    fetch('/api/verify-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsValidating(false);
        } else {
          setTokenError('This reset link is invalid or has expired.');
          setTimeout(() => {
            router.push('/forgot-password?error=invalid-token');
          }, 3000);
        }
      })
      .catch(() => {
        setTokenError('Unable to verify reset link.');
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
      });
    */

    // For now, just allow if token exists
    setIsValidating(false);
  }, [token, router]);

  const handleReset = (e) => {
    e.preventDefault();

    // Validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      alert("Password must contain at least one number!");
      return;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must contain at least one special character!");
      return;
    }

    if (password !== cpassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send password reset request with token
    // Uncomment and implement when your API is ready
    /*
    fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsSuccess(true);
        } else {
          alert(data.message || 'Failed to reset password');
        }
      })
      .catch(() => {
        alert('An error occurred. Please try again.');
      });
    */

    console.log("Password reset successful with token:", token);
    setIsSuccess(true);
  };

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="bg-(--custom-green) md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col rounded-md shadow-lg text-black md:text-white">
          <h2 className="py-6 font-semibold">VartsySMS</h2>
          <p className="text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenError) {
    return (
      <div className="bg-(--custom-green) md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col rounded-md shadow-lg text-black md:text-white">
          <h2 className="py-6 font-semibold">VartsySMS</h2>
          <div className="text-center px-4">
            <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
              Invalid Reset Link
            </h1>
            <p className="py-5 text-xs md:text-sm">{tokenError}</p>
            <p className="text-xs md:text-sm">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success view
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
              <Button className="md:bg-white bg-(--custom-green) text-white md:text-(--custom-green) mb-4">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="bg-(--custom-green) md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col rounded-md shadow-lg text-black md:text-white">
        <h2 className="py-6 font-semibold">VartsySMS</h2>
        <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl">
          Password Reset
        </h1>

        <form onSubmit={handleReset} className="w-11/12 md:w-5/12 pb-10">
          {/* Desktop Password Input */}
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

          {/* Mobile Password Input */}
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

          <Button
            type="submit"
            className="md:bg-white bg-(--custom-green) text-white md:text-(--custom-green) w-full mt-2 md:mt-10"
          >
            Change password
          </Button>
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

export default ResetPasswordForm;
