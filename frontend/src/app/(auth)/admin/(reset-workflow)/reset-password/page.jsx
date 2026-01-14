import Logo from "@/assets/white.svg";
import ResetPasswordForm from "./component/form";
export const metadata = {
  title: " Reset Password | Vartsy Campus ",
  description: "Reset your VartsySMS password - workflow 2",
  icons: {
    icon: Logo.src,
  },
};
function ResetPW() {
  return <ResetPasswordForm />;
}

export default ResetPW;
