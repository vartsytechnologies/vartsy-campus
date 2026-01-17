import Logo from "@/assets/white.svg";
import ForgotPasswordForm from "./component/form";

export const metadata = {
  title: " Forgot Password | Vartsy Campus ",
  description: "Forgot your VartsySMS password? Reset it here - workflow 1",
  icons: {
    icon: Logo.src,
  },
};
function ForgotPW() {
  return <ForgotPasswordForm />;
}

export default ForgotPW;
