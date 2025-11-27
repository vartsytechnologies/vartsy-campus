import React from 'react';
import '../../assets/css/tailwind.css';
import bg from '../../assets/bg.jpg';
import '../../assets/css/tailwind.css';
// import '../../assets/css/main.css';
import LandingNav from './LandingNav';
import Stats from './Stats';

export default function Hero(){
  return (
    <>
        <section className="relative text-[#f8f3f8] overflow-hidden" aria-labelledby="hero-heading">
          {/* Background image layer - visible on md+ screens (reduced opacity) */}
          <div className="absolute inset-0 hidden md:block bg-cover bg-center" style={{backgroundImage:`url(${bg})`, opacity: 0.85}} />
          
          {/* Gradient overlay - fades from opaque left to transparent right */}
          <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, rgba(2, 16, 96, 1) 0%, rgba(2, 16, 96, 0.87) 25%, rgba(0, 162, 255, 0.71) 66%, rgba(0, 162, 255, 0.71) 100%)'}} />
          
          {/* Content container */}
          <div className="relative z-10">
            <LandingNav />

      <div className="relative max-w-[1100px] mx-auto px-5 pt-16 pb-24 flex flex-col gap-5">
        <div className="mt-3">
            <h1 id="hero-heading" className="text-[clamp(3.6rem,3.8vw,2.5rem)] leading-[1.02] m-0 font-medium text-left text-white">
              Boost academic <br/> performance with our
              <br/>
              student management module
            </h1>
          <p className="mt-3 md:max-w-[50%] text-left text-white/90 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum purus dui, blandit sit amet tortor convallis, elementum semper eros.</p>
          <div className="mt-5 text-left">
            <a className="inline-block bg-[#00efd1] text-[#062023] px-5 py-3 rounded-full font-bold shadow-[0_6px_18px_rgba(0,0,0,0.25)]" href="#register">Register</a>
          </div>
        </div>
      </div>

      <Stats />
          </div>
    </section>
    </>
  )
}
