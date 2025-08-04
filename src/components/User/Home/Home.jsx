import { useEffect } from "react";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import Hero from "./Hero";
import Features from "./Features";
import Stats from "./Stats";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/user/report");
    } else {
      navigate("/auth/login");
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Stats />

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-green-700 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Join Our Mission for Cleaner Communities
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              Be part of the solution. Start recycling smarter and making a
              difference in your neighborhood today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              
              <button
                onClick={handleClick}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-green-700 hover:bg-opacity-10 transition-transform transform hover:-translate-y-1 duration-300"
              >
                Report Your First Issue
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
