import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Leaf } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-6">
      <Card className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl rounded-2xl border-0">
        {/* Left: Overview and Info */}
        <div className="bg-green-100 p-8 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-green-800 flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-700" />
            EcoCycleHub
          </h2>
          <p className="mt-4 text-gray-700 text-base leading-relaxed">
            Help make your city cleaner and greener! 🌍
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            EcoCycleHub empowers you to report waste issues in your area and earn
            rewards for your contribution to the environment. Whether it's
            litter, illegal dumping, or broken bins — your report matters.
          </p>

          <div className="mt-6">
            <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
              <li>Report waste with photos & location</li>
              <li>Earn points and redeem rewards</li>
              <li>Track local cleanup impact</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link to="/auth/login">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-md py-6 rounded-xl">
                Login
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-700 hover:bg-green-50 py-6 rounded-xl"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Illustration or Visual */}
        <div className="bg-white flex items-center justify-center p-4">
          <img
            src="https://res.cloudinary.com/dzbpm0jt3/image/upload/v1748695819/2374_Waste_Management_-_HEAL_THE_PLANET_wjllub.jpg"
            alt="Waste Reporting Illustration"
            className="w-full max-w-xs md:max-w-md"
          />
        </div>
      </Card>
    </div>
  );
};

export default GetStarted;
