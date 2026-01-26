import Link from "next/link";
import Google from "../component/google";
import { Separator } from "@/components/ui/separator";
import Carousel from "./components/carousel";
import Logo from "@/assets/white.svg";

import LoginForm from "./components/form";
export const metadata = {
  title: " Login | Vartsy Campus ",
  description: "Login to your VartsySMS account",
  icons: {
    icon: Logo.src,
  },
};
function Login() {
  return (
    <>
      <div className="md:bg-white bg-(--custom-white)  w-full min-h-screen flex items-center justify-center">
        <div className="w-11/12 lg:w-8/12  md:rounded-md md:shadow-lg grid grid-cols-1 md:grid-cols-2 text-black">
          <div className="hidden md:block bg-(--custom-green) rounded-l-[7.1px]">
            <Carousel />
          </div>
          <div className="py-10 md:py-15  px-5 xl:px-8 ">
            <div className="flex justify-between ">
              <h2 className="text-xl md:text-2xl font-semibold">
                Welcome Back!
              </h2>
              <Link
                href="/"
                className="text-(--custom-green) font-medium underline text-xs md:text-sm"
              >
                Back to home
              </Link>
            </div>
            <p className="text-[#606060] text-sm">
              Sign into your account for more productivity
            </p>
            <div className="flex gap-1 flex-col mt-5">
              <Google text="Log in with Google" />
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
            {/* Form component */}
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
