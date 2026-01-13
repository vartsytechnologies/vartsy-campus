"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  };
  return (
    <>
      <form id="handle-login" onSubmit={handleLogin}>
        {/* With floating label */}
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            placeholder=""
            value={email}
            required
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
            className=" hidden md:block
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
          <input
            id="password"
            name="password"
            type={eye ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        <div className="flex items-end mt-1 justify-end ">
          <Link href="/forgot-password">
            <p className="text-xs md:text-sm font-medium text-(--custom-green)">
              Forgot your password?
            </p>
          </Link>
        </div>
        <Button
          type="submit"
          className="bg-(--custom-green) text-white hover:bg-(--custom-green) hover:text-white w-full mt-2 md:mt-4"
        >
          Log in
        </Button>
        <div className="flex items-start justify-start mt-1 font-medium border-red-500">
          <p className="text-xs md:text-sm ">
            Don't have an account?
            <Link href="/signup">
              <span className="ml-2 text-(--custom-green)">
                Create an account
              </span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
export default LoginForm;
