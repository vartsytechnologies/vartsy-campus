"use client";
import { Mail } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmission = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <>
      <div className="mt-12 flex-col md:w-10/12 w-11/12 mx-auto flex md:items-center justify-center">
        <h1 className="cursor-target text-2xl md:text-4xl font-bold text-(--custom-blue-2)">
          Contact Us
        </h1>
      </div>

      <div className="relative md:p-8 w-full md:w-10/12 mx-auto mb-0 md:mb-12 mt-5 md:mt-8  pb-12 rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
          <div className="order-2 md:order-1 w-11/12 mx-auto lg:w-full flex  flex-col px-5 md:px-6 lg:px-0 py-7 md:py-0 justify-start">
            <div className="grid grid-cols-1 gap-6 md:gap-8 py-4 ">
              <div className="flex flex-row gap-4 md:gap-6 items-start group transition-all duration-300">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <Mail
                    className="w-6 h-6"
                    style={{ color: "var(--custom-blue-2)" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
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
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <FaWhatsapp
                    className="w-6 h-6"
                    style={{ color: "var(--custom-blue-2)" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
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
                  className="w-12 h-12 rounded-lg md:w-14 md:h-14  border backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  style={{ borderColor: "var(--custom-blue-2)" }}
                >
                  <FaWhatsapp
                    className="w-6 h-6 "
                    style={{
                      color: "var(--custom-blue-2)",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl mb-1 text-(--custom-blue-2)">
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

          <div className="order-1 md:order-2 flex items-start justify-center px-5 md:px-6 lg:px-0 ">
            <div className="w-full rounded-none overflow-hidden p-0 border-none">
              <form className="w-full mt-5" onSubmit={handleSubmission}>
                <div className="flex flex-col gap-8 text-sm md:text-base">
                  <div className="grid">
                    <label
                      htmlFor="name"
                      className="font-medium text-(--custom-blue-2) "
                    >
                      Full Name *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        type="text"
                        placeholder="eg. John Mensah"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="email"
                      className="font-medium text-(--custom-blue-2) "
                    >
                      Email Address *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="eg. john.mensah@company.com"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="phone"
                      className="font-medium text-(--custom-blue-2) "
                    >
                      Phone Number *
                    </label>
                    <div className="relative w-full">
                      <input
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        className="font-medium w-full rounded-lg mt-1 bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid">
                    <label
                      htmlFor="message"
                      className="font-medium text-(--custom-blue-2) "
                    >
                      Message *
                    </label>
                    <div className="relative w-full">
                      <textarea
                        id="message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        placeholder="Tell us about your project or ask any questions..."
                        className="font-medium w-full rounded-lg mt-1 resize-none bg-transparent border border-(--custom-blue-2) text-(--custom-blue-2) placeholder-slate-500 py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="rounded-lg w-full py-5 md:text-lg font-semibold text-white hover:opacity-90 transition-all duration-300 cursor-pointer"
                    style={{ backgroundColor: "var(--custom-blue-2)" }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
