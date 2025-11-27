import React from 'react';

function StatItem({ number, label }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-4xl md:text-5xl font-bold text-[#2b2b2b]">{number}</div>
      <div className="mt-2 text-sm md:text-base font-medium text-[#2b2b2b]">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="max-w-[1100px] mx-auto px-5 -mt-8">
      <div className="flex gap-4 justify-between items-center bg-[#feeef0] rounded-[18px] py-6 md:py-8 px-6 md:px-8">
        <StatItem number="200+" label="Schools Enrolled" />
        <div className="w-px h-16 md:h-20 bg-black/10" />
        <StatItem number="16" label="Regions In Ghana" />
        <div className="w-px h-16 md:h-20 bg-black/10" />
        <StatItem number="20+" label="Schools Enrolled" />
      </div>
    </div>
  );
}
