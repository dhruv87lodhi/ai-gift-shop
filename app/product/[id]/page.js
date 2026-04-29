"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Truck, ShieldCheck, ShoppingCart, Loader2, View, Minus, Plus, Trash2 } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import ARViewer, { hasARSupport } from "@/components/ARViewer";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, use } from "react";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);

  // Get the current quantity of this product in the cart
  const cartItem = cartItems.find((item) => String(item.id) === String(id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchProductData = async () => {
      try {
        const [productRes, similarRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/product/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/product/${id}/similar`)
        ]);

        if (productRes.ok) {
          const data = await productRes.json();
          setProduct(data);
        } else {
          console.error("Failed to fetch product");
        }

        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarProducts(similarData.similar || []);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleAddSimilarToCart = (e, similarProduct) => {
    e.preventDefault();
    addToCart(similarProduct);
    // Could add per-item state, but for quick add, toast is handled globally or via simple UI
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#caa161] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Product Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the product you're looking for.</p>
        <Link href="/" className="px-6 py-3 bg-[#caa161] text-white rounded-full font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#caa161] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass border border-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.srcset = ""; }}
          />
          {/* 3D AR Badge */}
          {hasARSupport(product.id) && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
              <View className="w-4 h-4" />
              3D / AR
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#caa161]/15 text-[#9a7638] w-max">
            {product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-1 rounded-full bg-green-100 text-green-600">
                <Check className="w-4 h-4" />
              </div>
              <span>In stock and ready to ship</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                <Truck className="w-4 h-4" />
              </div>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-1 rounded-full bg-orange-100 text-orange-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>1-year premium warranty included</span>
            </div>
          </div>

          {quantityInCart > 0 ? (
            <div className="w-full flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => {
                    if (quantityInCart <= 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQuantity(product.id, quantityInCart - 1);
                    }
                  }}
                  className="p-4 hover:bg-gray-200 transition-colors text-gray-700"
                >
                  {quantityInCart <= 1 ? <Trash2 className="w-5 h-5 text-red-500" /> : <Minus className="w-5 h-5" />}
                </button>
                <span className="px-6 py-4 font-bold text-lg text-gray-900 min-w-[60px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="p-4 hover:bg-gray-200 transition-colors text-gray-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {/* Added indicator */}
              <div className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                <Check className="w-5 h-5" /> In Cart
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] hover:from-[#b08a50] hover:to-[#9a7638] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#caa161]/20 flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>
          )}

          {/* AR Preview Button */}
          <ARViewer productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-16 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-[#caa161] rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar">
            {similarProducts.map((simProd) => (
              <div 
                key={simProd.id} 
                className="snap-start shrink-0 w-72 glass p-4 rounded-2xl border border-gray-200 hover:border-[#caa161] transition-all group flex flex-col relative"
              >
                {/* Recommended Badge */}
                <div className="absolute top-6 left-6 z-10 px-2 py-1 bg-[#caa161] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg">
                  Recommended
                </div>

                <div className="aspect-square relative rounded-xl overflow-hidden mb-4 bg-gray-100">
                  <img 
                    src={simProd.image} 
                    alt={simProd.name} 
                    loading="lazy" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80"; e.currentTarget.onerror = null; }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-md text-gray-900 text-xs font-bold rounded-lg">
                    ₹{simProd.price}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7638] mb-1 block">{simProd.category}</span>
                  <h3 className="font-bold text-gray-900 truncate mb-2">{simProd.name}</h3>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Link 
                    href={`/product/${simProd.id}`} 
                    className="flex-1 py-2 bg-gray-100 border border-gray-200 text-gray-900 text-center text-xs font-bold rounded-xl hover:bg-[#caa161] hover:border-[#caa161] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    View Product
                  </Link>
                  <button 
                    onClick={(e) => handleAddSimilarToCart(e, simProd)}
                    className="p-2 bg-[#caa161]/15 text-[#caa161] rounded-xl hover:bg-[#caa161] hover:text-white transition-colors"
                    title="Quick Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
