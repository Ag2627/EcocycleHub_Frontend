import { Trash2, Map, Brain, Award, Recycle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const featuresData = [
  {
    icon: Trash2,
    title: "Report Waste Issues",
    description: "Quickly report garbage collection problems with photo uploads and location tagging for faster resolution.",
    color: "bg-eco-100 text-eco-700",
    delay: "0"
  },
  {
    icon: Map,
    title: "Locate Recycling Centers",
    description: "Find the nearest recycling facilities based on your location and specific waste type needs.",
    color: "bg-water-100 text-water-700",
    delay: "100"
  },
  {
    icon: Brain,
    title: "AI Waste Sorting Guide",
    description: "Upload photos of waste items to receive instant AI-powered guidance on proper disposal methods.",
    color: "bg-earth-100 text-earth-700",
    delay: "200"
  },
  {
    icon: Award,
    title: "Earn Recycling Rewards",
    description: "Get points for sustainable actions that can be redeemed for discounts and eco-friendly products.",
    color: "bg-eco-100 text-eco-700",
    delay: "300"
  },
  {
    icon: Recycle,
    title: "Track Your Impact",
    description: "Monitor your environmental contributions and see the collective difference your community is making.",
    color: "bg-water-100 text-water-700",
    delay: "400"
  },
  {
    icon: Users,
    title: "NGO & Community Collaboration",
    description: "Connect with local environmental organizations and participate in community cleanup initiatives.",
    color: "bg-earth-100 text-earth-700",
    delay: "500"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn(
            "text-3xl font-bold mb-4",
            "bg-gradient-to-r from-eco-700 to-water-700 text-transparent bg-clip-text"
          )}>
            Features Designed for Sustainable Communities
          </h2>
          <p className="text-foreground/70 text-lg">
            Our platform provides all the tools you need to participate in creating
            cleaner, greener neighborhoods while earning rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-xl shadow-sm hover:shadow-md p-6",
                "border border-gray-100 transition-all duration-300 transform",
                "hover:border-eco-200 hover:-translate-y-1"
              )}
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                feature.color
              )}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;