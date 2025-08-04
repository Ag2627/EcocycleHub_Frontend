import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const statsData = [
  { 
    label: "Waste Reports", 
    value: 5280, 
    prefix: "", 
    suffix: "+", 
    color: "from-eco-600 to-eco-500" 
  },
  { 
    label: "Recycling Centers", 
    value: 890, 
    prefix: "", 
    suffix: "", 
    color: "from-water-600 to-water-500" 
  },
  { 
    label: "Rewards Redeemed", 
    value: 32500, 
    prefix: "$", 
    suffix: "", 
    color: "from-earth-600 to-earth-500" 
  },
  { 
    label: "Active Communities", 
    value: 120, 
    prefix: "", 
    suffix: "+", 
    color: "from-eco-600 to-water-600" 
  }
];

const Stats = () => {
  const [counters, setCounters] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const statsSection = document.getElementById("stats");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // ms
    const framesPerSecond = 60;
    const totalFrames = duration / 1000 * framesPerSecond;
    
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      
      const progress = Math.min(frame / totalFrames, 1);
      // Easing function: cubic bezier easing
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      setCounters(
        statsData.map((stat, index) => {
          return Math.round(eased * stat.value);
        })
      );
      
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, 1000 / framesPerSecond);
  };

  return (
    <section id="stats" className="py-20 bg-eco-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={cn(
            "text-3xl font-bold mb-4",
            "bg-gradient-to-r from-eco-700 to-water-700 text-transparent bg-clip-text"
          )}>
            Our Impact So Far
          </h2>
          <p className="text-foreground/70 text-lg">
            Together, we're making significant progress toward cleaner communities
            and a more sustainable future.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-xl shadow-sm p-6 text-center",
                "border border-gray-100 hover:border-eco-200",
                "transition-all duration-300 hover:shadow-md"
              )}
            >
              <h3 className={cn(
                "text-4xl font-bold mb-2",
                `bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`
              )}>
                {stat.prefix}{counters[index].toLocaleString()}{stat.suffix}
              </h3>
              <p className="text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;