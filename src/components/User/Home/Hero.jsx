import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-200 opacity-50 z-0"></div>

      {/* Green blob */}
      <div
        className="absolute -top-48 -right-48 w-96 h-96 bg-green-300 rounded-full filter blur-3xl opacity-30 z-0"
        style={{ transform: "rotate(120deg)" }}
      ></div>

      {/* Blue blob */}
      <div
        className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 z-0"
        style={{ transform: "rotate(30deg)" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6 animate-fadeIn">
            Connecting communities for cleaner environments
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-700 via-blue-500 to-green-600 text-transparent bg-clip-text mb-6 max-w-5xl animate-fadeIn">
            Revolutionizing Waste Management Through Community Action
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8 animate-fadeIn">
            Report collection issues, locate recycling centers, get AI-powered waste sorting
            guidance, and earn rewards for sustainable actions.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeIn">
            <Link
              to="/user/report"
              className="primary-button group w-full sm:w-auto flex items-center justify-center"
            >
              <span>Report Waste</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/user/centres"
              className="secondary-button group w-full sm:w-auto flex items-center justify-center"
            >
              <span>Find Recycling Centers</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button
            onClick={scrollToFeatures}
            className="mt-16 text-gray-500 hover:text-green-600 transition-colors flex flex-col items-center animate-bounce"
            aria-label="Scroll to features"
          >
            <span className="text-sm font-medium mb-2">Discover More</span>
            <ArrowDown size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
