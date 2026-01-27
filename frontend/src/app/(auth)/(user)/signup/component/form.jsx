"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);
  const [eye2, setEye2] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const body = {
      first_name: formData.get("firstname"),
      last_name: formData.get("lastname"),
      email: formData.get("email"),
      password: formData.get("password"),
      auth_provider: "local",
    };

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
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/register/`,
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
        setLoading(false);
        console.error("signup error:", response.status, data);

        let errorMessage = "Signup error";

        // Extract error
        if (data.detail?.email?.[0]) {
          errorMessage = data.detail.email[0];
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
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

      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setCpassword("");
      setLoading(false);

      toast.success("Account created! Please check your email to verify", {
        style: {
          background: "#3304a1",
          color: "white",
          fontSize: "15px",
          border: "none",
          borderRadius: "0",
        },
      });

      router.replace(`/check-email?email=${encodeURIComponent(email)}`);
      console.log("signup successful:", response.status, data);
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
      console.error("signup failed:", error);
    }
  };

  return (
    <>
      <form id="handle-login" onSubmit={handleSignUp}>
        {/* With floating label */}
        <div className="mt-4 grid grid-cols-2 mb-3 xl:mb-4 gap-3">
          <div>
            <div className="relative w-full">
              <input
                id="firstname"
                type="text"
                disabled={loading}
                name="firstname"
                placeholder=""
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
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
                htmlFor="firstname"
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
      bg-(--custom-white) md:bg-white 
      px-1
    "
              >
                First name
              </label>
              <label
                htmlFor="firstname"
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
                First name
              </label>
            </div>
          </div>
          <div>
            <div className="relative w-full">
              <input
                id="lastname"
                name="lastname"
                disabled={loading}
                type="text"
                placeholder=""
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
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
                htmlFor="lastname"
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
      bg-(--custom-white) md:bg-white 
      px-1
    "
              >
                Last name
              </label>
              <label
                htmlFor="lastname"
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
                Last name
              </label>
            </div>
          </div>
        </div>
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            name="email"
            disabled={loading}
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
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={eye ? "text" : "password"}
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              minLength={6}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {eye ? (
                <Eye strokeWidth={1} size={18} />
              ) : (
                <EyeOff strokeWidth={1} size={18} />
              )}
            </button>
          </div>
        </div>
        <div className="relative w-full mt-3 xl:mt-4">
          <div className="relative w-full">
            <input
              id="confirm-password"
              name="confirm-password"
              type={eye2 ? "text" : "password"}
              disabled={loading}
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              placeholder=" "
              minLength={6}
              required
              className="peer w-full rounded-md font-medium border border-[#606060] bg-transparent px-3 py-3 md:py-4 pr-10 text-sm text-black outline-none transition focus:border-[#3304a1]"
            />

            <label
              htmlFor="confirm-password"
              className="hidden md:block pointer-events-none absolute left-3 top-4 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-(--custom-white) md:bg-white  px-1"
            >
              Confirm Password
            </label>

            <label
              htmlFor="confirm-password"
              className="block md:hidden pointer-events-none absolute left-3 top-3 text-sm text-neutral-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#3304a1] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-(--custom-white) md:bg-white  px-1"
            >
              Confirm Password
            </label>

            <button
              type="button"
              onClick={() => setEye2(!eye2)}
              disabled={loading}
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

        <button
          type="submit"
          disabled={loading}
          className="flex items-center disabled:opacity-90 justify-center py-2 gap-2 text-sm rounded-sm bg-(--custom-green) cursor-pointer  text-white hover:bg-(--custom-green) hover:text-white w-full mt-3 md:mt-4"
        >
          {loading ? (
            <>
              Creating account
              <LoaderCircle
                size={15}
                className="animate-spin animation-duration:0.5s"
              />
            </>
          ) : (
            "Create account"
          )}
        </button>
        <div className="flex items-start justify-start mt-1 font-medium border-red-500">
          <p className="text-xs md:text-sm ">
            Have an account already?
            {loading ? (
              <span className="ml-2 text-(--custom-green)">Sign in</span>
            ) : (
              <Link href="/login">
                <span className="ml-2 text-(--custom-green)">Sign in</span>
              </Link>
            )}
          </p>
        </div>
      </form>
    </>
  );
}

export default SignupForm;
