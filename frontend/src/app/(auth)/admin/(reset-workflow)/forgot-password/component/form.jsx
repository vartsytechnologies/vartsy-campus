"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
          <h2 className="py-6 font-semibold">VartsySMS</h2>
          <div className="text-center px-4">
            <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
              Check your email
            </h1>
            <p className="py-5 text-xs md:text-sm">
              We've sent a password reset link to:
              <br />
              <span className="font-semibold">{email}</span>
            </p>
            <p className="text-xs md:text-sm mb-6">
              Click the link in the email to reset your password.
              <br />
              If you don't see it, check your spam folder.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              className="md:bg-white bg-(--custom-green) text-white md:text-(--custom-green) mb-4"
            >
              Send Another Link
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
          </div>
        </div>
      </div>
    );
  }

  //  normal form view
  return (
    <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
        <h2 className="py-6 font-semibold">VartsySMS</h2>
        <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl">
          Forgot your password?
        </h1>
        <p className="py-5 text-center text-xs md:text-sm px-4">
          Enter your email and submit for a password reset link.
          <br />
          Email should be the same as one used in the account creation.
        </p>
        <form onSubmit={handleReset} className="w-11/12 md:w-5/12 pb-10">
          <div className="hidden md:block relative w-full mt-5">
            <input
              id="email"
              type="email"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full rounded-md font-medium border border-white bg-transparent px-3 py-3 md:py-4 text-sm text-white outline-none transition focus:border-white"
            />
            <label
              htmlFor="email"
              className="hidden md:block pointer-events-none absolute left-3 top-4 text-sm text-white transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-[#3304a1] px-1"
            >
              Email address
            </label>
          </div>
          <div className="block md:hidden relative w-full mt-5">
            <input
              id="email-mobile"
              type="email"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 md:py-4 text-sm text-black outline-none transition focus:border-black"
            />
            <label
              htmlFor="email-mobile"
              className="block md:hidden pointer-events-none absolute left-3 top-4 text-sm text-black transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Email address
            </label>
          </div>
          <Button
            type="submit"
            className="md:bg-white bg-(--custom-green) cursor-pointer text-white md:text-(--custom-green) w-full mt-2 md:mt-10"
          >
            Get Link
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

export default ForgotPasswordForm;
