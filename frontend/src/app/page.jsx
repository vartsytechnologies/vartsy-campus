import Image from "next/image";
import Accordion from "./landingComponents/Accordion";
import item from "../assets/hero_landing.png";
import img from "../assets/img.png";
import sub from "../assets/sub.png";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer";
import Contact from "./landingComponents/Contact";

function Landing() {
  return (
    <>
      <header className="relative min-h-screen w-full bg-white">
        <Image
          src={item}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-l from-(--custom-blue-1)/50 to-(--custom-blue-2)/90  w-full h-full "></div>
        <Navbar />
        <div className="relative min-h-screen w-11/12 md:w-10/12 mx-auto  flex items-start justify-center space-y-10 flex-col">
          <p className="md:w-3/4 text-3xl md:text-4xl lg:text-6xl lg:leading-16 font-semibold tracking-tight">
            Boost academic <br /> performance with our <br />
            student management module
          </p>
          <p className="md:w-3/4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consectetur, maiores numquam culpa harum laudantium rerum dolor ut
            nemo eos velit, animi est incidunt odio quidem alias neque voluptas
            necessitatibus autem?
          </p>
          <button className="font-bold cursor-pointer hover:bg-(--custom-blue-3)/90 transition-colors duration-300 text-xl leading-none text-(--custom-blue-2) rounded-full bg-(--custom-blue-3)  px-10 py-4 flex items-center justify-center">
            Register
          </button>
        </div>
      </header>
      <div className="absolute left-1/2 -translate-x-1/2 z-11 -mt-11 w-11/12 shadow-lg md:w-10/12 rounded-3xl  bg-white flex items-center justify-around p-4">
        <div className="text-black border-r border-(--custom-blue-2) w-full flex items-center justify-center  flex-col md:flex-row">
          <p className="text-base lg:text-5xl p-2 font-semibold">200+</p>
          <p className="text-sm md:text-base">
            Schools <br />
            <span className="text-(--custom-blue-2)">Enrolled</span>
          </p>
        </div>
        <div className="text-black border-r border-(--custom-blue-2) w-full flex items-center justify-center  flex-col md:flex-row">
          <p className="text-base lg:text-5xl p-2 font-semibold">200+</p>
          <p className="text-sm md:text-base">
            Schools <br />
            <span className="text-(--custom-blue-2)">Enrolled</span>
          </p>
        </div>
        <div className="text-black w-full flex items-center justify-center  flex-col md:flex-row">
          <p className="text-base lg:text-5xl p-2 font-semibold">200+</p>
          <p className="text-sm md:text-base">
            Schools <br />
            <span className="text-(--custom-blue-2)">Enrolled</span>
          </p>
        </div>
      </div>
      <main className="relative w-full min-h-screen bg-(--custom-blue)/90 overflow-hidden">
        <div className="hidden w-[500px] h-[500px] rounded-full md:block absolute z-10 -right-60 top-[340px] -translate-y-1/2 bg-(--custom-blue-2) pointer-events-none"></div>
        <section className="relative w-11/12 mt-30 mx-auto md:w-10/12 grid grid-cols-1 md:grid-cols-2 z-15 gap-10 md:gap-0">
          <div className=" flex items-start gap-5 justify-between flex-col ">
            <div>
              <p className="md:w-3/4 text-xl md:text-3xl text-slate-900 md:leading-snug font-medium">
                Operational tools, Analytics & AI insights for Headmaster,
                Teachers, Non-teaching Staff, Accountant, students & parents.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button className="font-bold cursor-pointer hover:bg-(--custom-blue-3)/90 transition-colors duration-300 text-xl leading-none text-(--custom-blue-2) rounded-full bg-(--custom-blue-3) px-10 py-4">
                Explore Features
              </button>
            </div>
          </div>{" "}
          <div className="relative flex items-end justify-end">
            <div className="w-10/12 h-80 flex items-end justify-end rounded-lg overflow-hidden">
              <Image
                src={img}
                alt="Hero background"
                width={800}
                height={320}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute w-[300px] h-[200px] rounded-lg overflow-hidden z-10 -bottom-20 left-2">
              <Image
                src={sub}
                alt="Hero background"
                width={300}
                height={200}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section>
        <section className="relative w-11/12 mt-50 mx-auto md:w-10/12 ">
          <p className="w-full text-xl md:text-3xl text-slate-900 text-center font-medium">
            Rich Feature set to boost school-wide productivity and enhance
            collaboration among stakeholders in your school
          </p>
          <p className="text-sm md:text-base text-slate-900 w-full text-center mt-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure amet
            vero nulla quaerat? ullam sed, commodi corrupti fuga totam illo esse
            enim ex mollitia?
          </p>
          <div className="mt-20">
            <Accordion />
          </div>
        </section>
        <section className="w-full mt-30 mx-auto flex items-center flex-col space-y-6 justify-center  bg-(--custom-blue-2) py-20">
          <p className="w-11/12 text-2xl md:text-4xl text-center font-semibold">
            You can book a{" "}
            <span className="text-(--custom-blue-3) mr-2">free</span>
            demo session <br />
            for your school today!
          </p>
          <button className="font-bold cursor-pointer hover:bg-(--custom-blue-3)/90 transition-colors duration-300 text-xl leading-none text-(--custom-blue-2) rounded-full bg-(--custom-blue-3)  px-10 py-4 flex items-center justify-center">
            Book Now
          </button>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
export default Landing;
