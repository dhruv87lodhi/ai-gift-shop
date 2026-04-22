import { categories } from "@/data/mockData";
import CategoryCard from "@/components/CategoryCard";
import Chatbot from "@/components/Chatbot";

export default function CategoryPage() {
  return (
    <div className="min-h-screen px-6 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-[fade-in-up_0.5s_ease-out]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
          All Categories
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse our extensive collection of gifts organized by category to find exactly what you're looking for.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      <Chatbot />
    </div>
  );
}
