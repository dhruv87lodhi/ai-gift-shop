import Link from "next/link";
import * as LucideIcons from "lucide-react";

export default function CategoryCard({ category }) {
  // Dynamically render icon based on category.icon string
  const IconComponent = LucideIcons[category.icon] || LucideIcons.Gift;

  return (
    <Link
      href={`/category/${category.id}`}
      className="group relative flex flex-col justify-between p-6 h-48 rounded-[2rem] glass border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#caa161]/10 hover:-translate-y-2 hover:border-[#caa161]/50"
    >
      {/* Giant Watermark Icon */}
      <div className="absolute -right-6 -top-6 text-gray-100 transition-all duration-500 group-hover:text-[#caa161]/10 group-hover:scale-110 group-hover:-rotate-12 z-0">
        <IconComponent className="w-40 h-40" strokeWidth={1} />
      </div>

      {/* Top Left Small Icon with background */}
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 transition-colors duration-500 group-hover:bg-gradient-to-br group-hover:from-[#caa161] group-hover:to-[#b08a50] group-hover:text-white shadow-sm">
        <IconComponent className="w-6 h-6" />
      </div>

      {/* Title */}
      <div className="relative z-10 mt-auto">
        <h3 className="font-extrabold text-xl text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-[#9a7638]">
          {category.name}
        </h3>
        <div className="w-0 h-1 bg-gradient-to-r from-[#caa161] to-[#b08a50] mt-2 rounded-full transition-all duration-500 group-hover:w-12" />
      </div>
    </Link>
  );
}
