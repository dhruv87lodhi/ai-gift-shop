import { occasions } from "@/data/mockData";
import OccasionCard from "@/components/OccasionCard";
import Chatbot from "@/components/Chatbot";

export default function OccasionPage() {
  return (
    <div className="min-h-screen px-6 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-[fade-in-up_0.5s_ease-out]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
          Shop by Occasion
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Make every moment special. Find the perfect gift for upcoming events and celebrations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {occasions.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </div>
      <Chatbot />
    </div>
  );
}
