"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResendVerification from "../component/resendComponent";

function CheckEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  useEffect(() => {
    if (!email) {
      router.replace("/signup");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }
  return (
    <div className="bg-white md:bg-(--custom-white) w-full min-h-screen flex items-center justify-center">
      <div className="w-11/12 md:w-8/12 bg-white md:bg-(--custom-green) py-10 md:py-15 flex items-center justify-center flex-col md:rounded-md md:shadow-lg text-black md:text-white">
        <h2 className="py-6 font-semibold">VartsySMS</h2>

        <div className="text-center px-4">
          <h1 className="text-(--custom-green) md:text-(--custom-blue-3) font-semibold text-xl md:text-2xl mb-4">
            Check your email
          </h1>

          <p className="py-5 text-xs md:text-sm">
            We've sent a verification link to:
            <br />
            <span className="font-semibold">{email}</span>
          </p>

          <div className="bg-white md:bg-transparent p-4 rounded-md mb-4 text-left">
            <p className="text-xs md:text-sm font-semibold mb-2 text-(--custom-green) md:text-white">
              Check your inbox/spam folder & click the link to verify your email
            </p>
          </div>

          <div className="flex items-center justify-center mt-1 font-medium">
            <p className="text-xs md:text-sm">
              <span className="mr-2"> Didn't receive email?</span>

              <ResendVerification email={email} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;
