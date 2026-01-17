"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const accordionData = [
    {
      title: "Admin Functionalities",
      content:
        "Our comprehensive admin dashboard provides powerful tools for managing your entire educational institution. Administrators can easily oversee user accounts, manage course enrollments, generate detailed reports on student performance and attendance, configure system-wide settings, and maintain complete control over access permissions. The intuitive interface allows for bulk operations, automated notifications, and seamless integration with existing school management systems. Advanced analytics provide insights into institutional performance, helping administrators make data-driven decisions to improve educational outcomes and operational efficiency.",
    },
    {
      title: "Teachers Operational tools",
      content:
        "Teachers have access to a robust suite of tools designed to streamline classroom management and enhance the teaching experience. Create and distribute assignments with ease, track student progress in real-time, provide personalized feedback, and maintain digital gradebooks that automatically calculate scores. The platform supports multimedia lesson planning, interactive quizzes, and collaborative learning activities. Teachers can also schedule virtual office hours, communicate directly with students and parents, manage attendance records, and access a library of educational resources. Integration with popular learning management systems ensures a seamless workflow.",
    },
    {
      title: "Student special tools and resources",
      content:
        "Students benefit from a personalized learning environment tailored to their individual needs and learning pace. Access interactive course materials, submit assignments digitally, participate in discussion forums, and track your academic progress through comprehensive dashboards. Our platform offers study aids including flashcards, practice tests, and AI-powered tutoring assistance available 24/7. Students can collaborate with peers through group projects, access recorded lectures for review, receive instant feedback on assessments, and set personal learning goals. The mobile-friendly interface ensures learning can happen anywhere, anytime, with offline access to downloaded materials.",
    },
    {
      title: "Parents Module",
      content:
        "Parents stay connected and informed through our dedicated parent portal, which provides real-time visibility into their child's academic journey. Monitor attendance records, view grades and assignment submissions, communicate directly with teachers, and receive automated notifications about important deadlines and school events. The portal offers insights into learning progress with detailed performance analytics, helps identify areas where additional support may be needed, and facilitates parent-teacher conferences through integrated scheduling tools. Parents can also manage payment of school fees, update student information, and access important school documents and announcements all in one convenient location.",
    },
    {
      title: "Extra benefits",
      content:
        "Beyond core functionalities, our platform offers numerous additional benefits that enhance the overall educational experience. Enjoy cloud-based storage for unlimited document archiving, automated backup systems ensuring data security, customizable themes and layouts for personalized experiences, and multi-language support for diverse learning communities. The system includes built-in plagiarism detection, seamless video conferencing integration, digital library access, certificate generation, and comprehensive audit trails for compliance purposes. Regular platform updates introduce new features based on user feedback, while our dedicated support team provides training resources, technical assistance, and ensures smooth operation throughout the academic year.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {accordionData.map((item, index) => (
        <div
          key={index}
          className="border-b border-slate-600 hover:bg-[--custom-blue-1]/90 transition-colors duration-200"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex items-center justify-between text-left px-4 py-5"
          >
            <span className="font-semibold text-lg text-gray-800">
              {item.title}
            </span>
            <div className="shrink-0 ml-4">
              {openIndex === index ? (
                <Minus className="w-5 h-5 text-gray-800 transition-transform duration-300" />
              ) : (
                <Plus className="w-5 h-5 text-gray-800 transition-transform duration-300" />
              )}
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-6 text-gray-800 leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
