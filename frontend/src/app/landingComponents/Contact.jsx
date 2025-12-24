import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function Contact() {
  return (
    <>
      <div className="mt-12 flex-col md:w-10/12 w-11/12 mx-auto flex md:items-center justify-center">
        <h1 className="cursor-target text-2xl md:text-4xl font-bold text-(--custom-blue-2)">
          Contact Us
        </h1>
      </div>

      <div className="relative md:p-8 w-full md:w-10/12 mx-auto mb-12 mt-5 md:mt-12 pb-12 rounded-none">
        <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] md:gap-8">
          <div className="order-2 md:order-1 w-11/12 mx-auto lg:w-full flex md:p-8 flex-col py-7 md:py-0 justify-start">
            <div className="grid grid-cols-1 gap-6 md:gap-8 py-4">
              <div className="flex flex-row gap-4 md:gap-6 items-start group transition-all duration-300">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-none border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <Mail
                    className="w-6 h-6"
                    style={{ color: "var(--custom-blue-2)" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
                    Email Us
                  </h3>
                  <div>
                    <p className="text-sm font-normal md:text-lg opacity-90 hover:opacity-100 transition-opacity text-(--custom-blue-2)">
                      <a
                        href="mailto:info@vartsysystems.com"
                        className="hover:underline"
                      >
                        info@vartsysystems.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4 md:gap-6 items-start group transition-all duration-300">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-none border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <FaWhatsapp
                    className="w-6 h-6"
                    style={{ color: "var(--custom-blue-2)" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
                    Call Us
                  </h3>
                  <p className="text-sm font-normal md:text-lg opacity-90 text-(--custom-blue-2)">
                    <a
                      href="tel:/+233204567428"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      +233(0)20-456-7428
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-4 md:gap-6 items-start group transition-all duration-300">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-none border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <FaWhatsapp
                    className="w-6 h-6"
                    style={{ color: "var(--custom-blue-2)" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
                    Message Us
                  </h3>
                  <p className="text-sm font-normal md:text-lg opacity-90 text-(--custom-blue-2)">
                    <a
                      href="https://wa.me/233204567428"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      +233(0)20-456-7428
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex items-start justify-center px-5 md:px-6 lg:px-0">
            <div className="w-full rounded-none overflow-hidden p-0 border-none">
              <div className="w-full mt-5">
                <div className="flex flex-col gap-8 text-sm md:text-base">
                  <div className="grid">
                    <label
                      htmlFor="name"
                      className="font-medium text-(--custom-blue-2) opacity-60"
                    >
                      Full Name *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="eg. John Mensah"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="email"
                      className="font-medium text-(--custom-blue-2) opacity-60"
                    >
                      Email Address *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="eg. john.mensah@company.com"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="phone"
                      className="font-medium text-(--custom-blue-2) opacity-60"
                    >
                      Phone Number *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="message"
                      className="font-medium text-(--custom-blue-2) opacity-60"
                    >
                      Message *
                    </label>
                    <div className="relative w-full">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your project or ask any questions..."
                        className="font-medium w-full rounded-lg mt-1 resize-none bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="rounded-lg w-full py-5 md:text-lg font-semibold text-white hover:opacity-90 transition-all duration-300"
                    style={{ backgroundColor: "var(--custom-blue-2)" }}
                  >
                    <div className="flex items-center justify-center gap-5">
                      <p>Send Message</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
