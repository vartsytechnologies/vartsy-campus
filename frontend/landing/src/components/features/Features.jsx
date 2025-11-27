import React from 'react';
import dashboard from '../../assets/dashboard.png';
import featureSnippet from '../../assets/feature_snippet.png';

export default function Features() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* SVG Circle background decoration */}
      <svg
        className="absolute -right-32 -top-32 w-96 h-96 opacity-5"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="100" fill="#5b21b6" />
      </svg>

      <div className="relative z-10 max-w-[1100px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold text-[#1a1a1a]">
              Operational tools, Analytics & AI insights for Headmaster, Teachers, Non-teaching Staff, Accountant, students & parents.
            </h2>
            <p className="text-base md:text-lg text-[#666] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum purus dui, blandit sit amet tortor convallis.
            </p>
            <div className="mt-4">
              <button className="inline-block bg-[#00efd1] text-[#062023] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
                Explore features
              </button>
            </div>
          </div>

          {/* Right Images with overlay */}
          <div className="relative h-80 md:h-96 flex items-center justify-center">
            {/* Circle background SVG for dashboard */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#5b21b6', stopOpacity: 0.15 }} />
                  <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.15 }} />
                </linearGradient>
              </defs>
              <circle cx="200" cy="200" r="200" fill="url(#circleGrad)" />
              <circle cx="200" cy="200" r="200" fill="none" stroke="#5b21b6" strokeWidth="2" opacity="0.1" />
            </svg>

            {/* Dashboard image */}
            <img
              src={dashboard}
              alt="Dashboard"
              className="absolute bottom-0 left-0 w-3/4 md:w-4/5 h-auto object-contain rounded-2xl shadow-2xl z-20"
            />

            {/* Feature snippet overlay */}
            <img
              src={featureSnippet}
              alt="Feature Snippet"
              className="absolute top-0 right-0 w-1/2 md:w-2/5 h-auto object-contain rounded-xl shadow-lg z-30"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
