import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="group relative glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#caa161]/20">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-gray-300 hover:text-white hover:bg-[#caa161] transition-colors z-10">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#caa161]">
            {product.category}
          </span>
          <span className="font-bold text-lg text-white">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#caa161] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {product.description}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="block w-full py-2.5 px-4 bg-white text-black text-center font-bold rounded-xl hover:bg-[#caa161] hover:text-white transition-colors"
        >
          View Gift
        </Link>
      </div>
    </div>
  );
}
