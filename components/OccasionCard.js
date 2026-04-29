"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function OccasionCard({ occasion }) {
  return (
    <Link
      href={`/category?q=${encodeURIComponent(occasion.name)}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] aspect-[3/4] w-full bg-white isolation-auto border border-gray-200 hover:border-[#caa161]/50 transition-all duration-500 shadow-sm hover:shadow-xl"
    >
      {/* Top Image Section */}
      <div className="relative h-[70%] w-full overflow-hidden">
        <Image
          src={occasion.image}
          alt={occasion.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.srcset = ""; }}
        />
        {/* Subtle gradient overlay to merge with bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
      </div>

      {/* Bottom Content Section */}
      <div className="relative h-[30%] w-full flex flex-col justify-center p-6 bg-white transition-colors duration-500 group-hover:bg-[#faf8f5]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#9a7638] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
              Shop Gifts
            </p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-wide group-hover:text-[#9a7638] transition-colors">
              {occasion.name}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#caa161] group-hover:border-[#caa161] group-hover:text-white transition-all duration-500">
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Decorative Gold Accent Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#caa161] to-[#b08a50] w-0 group-hover:w-full transition-all duration-700 ease-out" />
    </Link>
  );
}
