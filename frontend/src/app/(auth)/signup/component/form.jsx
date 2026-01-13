"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // validation

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
  };
  return (
    <>
      <form id="handle-login" onSubmit={handleSignUp}>
        {/* With floating label */}
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            placeholder=""
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
      peer
      w-full
      rounded-md
      font-medium
      border
      border-[#606060]
      bg-transparent
      px-3
      py-3 md:py-4
      text-sm
      text-black
      outline-none
      transition
      focus:border-[#3304a1]
    "
          />

          <label
            htmlFor="email"
            className="hidden md:block
      pointer-events-none
      absolute
      left-3
      top-4
      text-sm
      text-neutral-500
      transition-all
       peer-placeholder-shown:top-4
      peer-placeholder-shown:text-sm
      peer-focus:-top-2
      peer-focus:text-xs
      peer-focus:text-[#3304a1]
      peer-[:not(:placeholder-shown)]:-top-2
      peer-[:not(:placeholder-shown)]:text-xs
      bg-white
      px-1
    "
          >
            Email address
          </label>
          <label
            htmlFor="email"
            className="block md:hidden
      pointer-events-none
      absolute
      left-3
      top-4
      text-sm
      text-neutral-500
      transition-all
       peer-placeholder-shown:top-3

      peer-placeholder-shown:text-sm
      peer-focus:-top-2
      peer-focus:text-xs
      peer-focus:text-[#3304a1]
      peer-[:not(:placeholder-shown)]:-top-2
      peer-[:not(:placeholder-shown)]:text-xs
      bg-white
      px-1
    "
          >
            Email address
          </label>
        </div>

        <div className="relative w-full mt-4">
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={eye2 ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-black outline-none transition focus:border-[#3304a1]"
            />

            <label
              htmlFor="password"
              className="hidden md:block pointer-events-none absolute left-3 top-4 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Password
            </label>

            <label
              htmlFor="password"
              className="block md:hidden pointer-events-none absolute left-3 top-3 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Password
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
        </div>
        <div className="relative w-full mt-4">
          <div className="relative w-full">
            <input
              id="confirm-password"
              name="confirm-password"
              type={eye2 ? "text" : "password"}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder=" "
              minLength={6}
              required
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-black outline-none transition focus:border-[#3304a1]"
            />

            <label
              htmlFor="confirm-password"
              className="hidden md:block pointer-events-none absolute left-3 top-4 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Confirm Password
            </label>

            <label
              htmlFor="confirm-password"
              className="block md:hidden pointer-events-none absolute left-3 top-3 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-white px-1"
            >
              Confirm Password
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
        </div>

        <Button
          type="submit"
          className="bg-(--custom-green)  text-white hover:bg-(--custom-green) hover:text-white w-full mt-3 md:mt-4"
        >
          Create account
        </Button>
        <div className="flex items-start justify-start mt-1 font-medium border-red-500">
          <p className="text-xs md:text-sm ">
            Have an account already?
            <Link href="/login">
              <span className="ml-2 text-(--custom-green)">Sign in</span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default SignupForm;
