import AuthCarousel from "../../component/carousel";
import firstImage from "@/assets/signup.png";
import signup2 from "@/assets/signup2.svg";
import signup3 from "@/assets/signup3.svg";

function SignupCarousel() {
  const loginSlides = [
    {
      image: firstImage,
      heading: "Stay Connected",
      description:
        "Keep track of your progress and collaborate with your team seamlessly.",
    },
    {
      image: signup2,
      heading: "Welcome Back!",
      description:
        "Access your personalized dashboard and continue where you left off.",
    },
    {
      image: signup3,
      heading: "Achieve More",
      description:
        "Unlock powerful features to boost your productivity every day.",
    },
  ];
  return <AuthCarousel slides={loginSlides} />;
}
export default SignupCarousel;
