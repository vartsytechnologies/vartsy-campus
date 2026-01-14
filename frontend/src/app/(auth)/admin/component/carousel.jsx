// "use client";
// import React, { useState, useEffect } from "react";

// const AuthCarousel = ({ slides, autoPlayInterval = 5000 }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, autoPlayInterval);

//     return () => clearInterval(interval);
//   }, [slides.length, autoPlayInterval]);

//   return (
//     <div className="relative h-full w-full  rounded-l-lg overflow-hidden">
//       {/* Slides */}
//       <div className="relative h-full w-full">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-white transition-opacity duration-700 ease-in-out ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             {slide.image && (
//               <div className="mb-6 w-64 h-64 flex items-center justify-center">
//                 <img
//                   src={slide.image}
//                   alt={slide.heading}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </div>
//             )}

//             <h2 className="text-3xl font-bold mb-4 text-center">
//               {slide.heading}
//             </h2>

//             <p className="text-lg text-center text-purple-100 max-w-md">
//               {slide.description}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Dots */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               index === currentSlide ? "bg-white w-8" : "bg-white/40 w-2"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AuthCarousel;
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AuthCarousel = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoPlayInterval]);

  return (
    <div className="relative h-full w-full rounded-l-lg overflow-hidden">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-white transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.image && (
              <div className="mb-6 relative w-64 h-64">
                <Image
                  src={slide.image}
                  alt={slide.heading}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            )}

            <h2 className="text-xl xl:text-3xl font-bold mb-4 text-center">
              {slide.heading}
            </h2>

            <p className="text-base xl:text-lg text-center text-purple-100 max-w-md">
              {slide.description}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/40 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthCarousel;
