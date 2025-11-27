export default function LandingNav(){
  return (
    <header className="p-0 pt-5">
      <div className="bg-white rounded-full mx-5 flex items-center justify-between px-4 shadow-[0_6px_6px_rgba(0,0,0,0.2)] sticky top-2">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-[#6ee7b7] shadow-[0_2px_6px_rgba(0,0,0,0.08)]" />
          <div className="font-bold text-[#0f172a]">VartsySMS</div>
        </div>

        <div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="text-[#0f172a]">About</a>
            <a href="#features" className="text-[#0f172a]">Features</a>
            <a href="#features" className="text-[#0f172a]">Book a demo</a>
            <a href="#features" className="text-[#0f172a]">Contact</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-[#2a1bd9] text-white px-4 py-2 rounded-full font-semibold">Register</button>
        </div>
      </div>
    </header>
  )
}
