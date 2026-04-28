import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

export default function CategoryCard({ category }) {
  const IconComponent = LucideIcons[category.icon] || LucideIcons.Gift;

  return (
    <Link
      href={`/category?q=${encodeURIComponent(category.name)}`}
      className="group flex flex-col items-center bg-[#fff8f8] p-3 rounded-[2.5rem] transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/20 bg-white flex items-center justify-center">
        {category.image ? (
          <Image 
            src={category.image} 
            alt={category.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <IconComponent className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <span className="font-bold text-charcoal group-hover:text-primary transition-colors text-center pb-2 px-2">{category.name}</span>
    </Link>
  );
}
