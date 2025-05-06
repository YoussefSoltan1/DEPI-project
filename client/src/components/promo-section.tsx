import { Button } from "@/components/ui/button";
import { Film, Download, Tv, BrainCircuit } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="py-10 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
        alt="Cinema theater"
        className="absolute w-full h-full object-cover"
      />
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Promo Content */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Enjoy Unlimited Entertainment
          </h2>
          <p className="text-white/80 text-lg mb-6">
            Access thousands of movies and TV shows at your fingertips.
          </p>
          <Button className="bg-secondary hover:bg-red-700 transition-colors duration-200 text-white py-3 px-8 rounded-circle text-lg font-medium">
            Start Watching
          </Button>
        </div>

        {/* Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-hoverBg/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="mb-4 w-16 h-16 bg-secondary rounded-circle flex items-center justify-center text-white mx-auto">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              HD Quality
            </h3>
            <p className="text-textSecondary">
              Stream in high-definition quality on all your devices.
            </p>
          </div>

          <div className="bg-hoverBg/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="mb-4 w-16 h-16 bg-secondary rounded-circle flex items-center justify-center text-white mx-auto">
              <Download className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Comprehensive Database
            </h3>
            <p className="text-textSecondary">
              Access detailed information about your favorite movies and TV
              shows.
            </p>
          </div>

          <div className="bg-hoverBg/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="mb-4 w-16 h-16 bg-secondary rounded-circle flex items-center justify-center text-white mx-auto">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Recommendations
            </h3>
            <p className="text-textSecondary">
              Discover new content tailored to your viewing preferences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
