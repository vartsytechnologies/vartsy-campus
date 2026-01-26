import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Logo from "@/assets/white.svg";

import LoginForm from "./components/form";
export const metadata = {
  title: " Login | Vartsy Campus ",
  description: "Login to the root account",
  icons: {
    icon: Logo.src,
  },
};
function Login() {
  return (
    <>
      <div className="md:bg-(--custom-green) bg-(--custom-white)  w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 lg:w-4/12 md:bg-white md:rounded-md md:shadow-lg  text-black">
          <div className="py-10 md:py-15  px-5 xl:px-8 max-w-lg mx-auto ">
            <div className="flex justify-between ">
              <h2 className="text-xl md:text-2xl font-semibold">
                Welcome Back!
              </h2>
            </div>
            <p className="text-[#606060] text-sm">
              Sign into your account for more productivity
            </p>
            <div className="flex gap-1 flex-col mt-5">
              <Button className="w-full cursor-pointer mb-1 xl:mb-2 bg-transparent border border-[#606060] ">
                Log in with Google
              </Button>
            </div>
            <div className="relative my-[5px] xl:my-3">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-[#606060]/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-(--custom-white) md:bg-white px-2 text-black font-medium">
                  Or
                </span>
              </div>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
