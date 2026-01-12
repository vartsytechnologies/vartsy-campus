import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full grid place-items-center bg-(--custom-blue-2) py-10 text-white">
      <div className="mx-auto w-11/12 md:w-10/12 gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1fr_1fr] my-10">
        {/* Company Column */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <ul className="text-sm space-y-1 [&>li]:hover:underline [&>li]:w-max [&>li]:transition-all [&>li]:duration-300">
            <li>
              <Link
                href="/home"
                className="font-normal transition-colors duration-300"
              >
                Home
              </Link>
            </li>{" "}
            <li>
              <Link
                href="/about"
                className="font-normal transition-colors duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors duration-300 font-normal"
              >
                Reach Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Services Column */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <ul className="text-sm space-y-1 font-normal">
            <li>Student Enrollment & Admissions</li>
            <li>Class Scheduling & Timetabling</li>
            <li>Attendance Tracking (Students & Staff)</li>
            <li>Gradebook & Report Cards</li>
            <li>Teacher & Staff Management</li>
          </ul>
        </div>

        {/* Get In Touch Column */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <div className="text-sm space-y-4">
            {/* Our Office */}
            <div className="space-y-1 font-normal">
              <p className="underline underline-offset-2">Phone/Message</p>

              <p>
                {" "}
                <a
                  href="tel:+233550988226"
                  className="transition-colors duration-300 block hover:opacity-80"
                >
                  +233(0) 550-988-226
                </a>
              </p>
            </div>

            {/* Email Us */}
            <div className="space-y-1 font-normal">
              <p className="underline underline-offset-2">Email </p>

              <p>
                <a
                  href="mailto:info@vartsysystems.com"
                  className="transition-colors duration-300 block hover:opacity-80"
                >
                  info@vartsysystems.com
                </a>
              </p>
            </div>
            <p className="text-sm mt-1">Available Mon-Fri, 8 AM-5 PM</p>
          </div>
        </div>

        {/* Ready to Get Started Column */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold mb-6">Want a free demo session?</h2>
          <Link href="/contact">
            <button className="font-bold cursor-pointer hover:bg-(--custom-blue-3)/90 transition-colors duration-300 text-xl leading-none text-(--custom-blue-2) rounded-full bg-(--custom-blue-3)  px-10 py-4 flex items-center justify-center">
              Book Now
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="w-11/12 mx-auto md:w-10/12 border-t border-white/20">
        <div className="w-full flex flex-col font-normal md:flex-row items-start md:items-center justify-between py-6 gap-1 md:gap-3">
          <p className="text-xs md:text-sm order-1 text-left">
            &copy; {new Date().getFullYear()} VartySMS. All rights reserved.
          </p>
          <div className="flex items-center order-2 self-start md:self-center text-xs md:text-sm">
            <span className="mr-2">Product of</span>
            <a
              href="https://vartsy-systems.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-all duration-300 group"
            >
              <span className="transition-colors duration-300 font-bold tracking-wide">
                Vartsy Systems
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
