"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import ResendVerify from "./resendlink";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResend(false);

    const formData = new FormData(e.currentTarget);

    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log("Login data submitted:", body);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/login/`,
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

      // Handle errors first
      if (!response.ok) {
        setLoading(false);
        console.error("Login error:", response.status, data);

        if (response.status === 403) {
          setShowResend(true);

          let errorMessage = "Please verify your email ";
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
          return;
        }

        let errorMessage = "Login error";

        // Extract other error
        if (data.detail) {
          if (typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (data.detail.error) {
            errorMessage = data.detail.error;
          }
        } else if (data.error) {
          errorMessage = data.error;
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
        return;
      }

      setLoading(false);

      setEmail("");
      setPassword("");

      toast.success("Logged in successfully!", {
        style: {
          background: "#3304a1",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });

      console.log("Login successful:", data);

      // Redirect to dashboard
      router.push("/onboarding");
    } catch (error) {
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
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <form id="handle-login" onSubmit={handleLogin}>
        {/* With floating label */}
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            name="email"
            placeholder=""
            disabled={loading}
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
      bg-(--custom-white) md:bg-white 
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
      bg-(--custom-white) md:bg-white 
      px-1
    "
          >
            Email address
          </label>
        </div>
        <div className="relative w-full mt-3 xl:mt-4">
          <input
            id="password"
            name="password"
            disabled={loading}
            type={eye ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-black outline-none transition focus:border-[#3304a1]"
          />

          <label
            htmlFor="password"
            className="hidden md:block pointer-events-none absolute left-3 top-4 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-(--custom-white) md:bg-white  px-1"
          >
            Password
          </label>

          <label
            htmlFor="password"
            className="block md:hidden pointer-events-none absolute left-3 top-3 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-(--custom-white) md:bg-white  px-1"
          >
            Password
          </label>

          <button
            type="button"
            disabled={loading}
            onClick={() => setEye(!eye)}
            className="absolute  right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
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

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center text-sm py-2 gap-2 rounded-sm bg-(--custom-green) cursor-pointer text-white hover:bg-(--custom-green) hover:text-white w-full mt-2 md:mt-4"
        >
          {loading ? (
            <>
              Logging in
              <LoaderCircle
                size={15}
                className="animate-spin animation-duration:0.5s"
              />
            </>
          ) : (
            "Log in"
          )}
        </button>
        <div className="mb-2 flex items-start justify-start mt-1 font-medium">
          <p className="text-xs md:text-sm ">
            Don't have an account?
            {loading ? (
              <span className="ml-2 text-(--custom-green)">
                Create an account
              </span>
            ) : (
              <Link href="/signup">
                <span className="ml-2 text-(--custom-green)">
                  Create an account
                </span>
              </Link>
            )}
          </p>
        </div>
        {showResend && <ResendVerify email={email} />}
      </form>
    </>
  );
}
export default LoginForm;
