import { Link } from "react-router-dom";
import { Leaf, Mail, MapPin, Phone, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-50 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-green-600">
              <Leaf size={28} />
              <span className="text-xl font-semibold">RecycleConnect</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              Connecting communities for a cleaner, greener future through
              innovative waste management solutions.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-green-600 hover:text-green-800" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-green-600 hover:text-green-800" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-green-600 hover:text-green-800" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/user/report" className="footer-link">Report Waste</Link></li>
              <li><Link to="/user/centres" className="footer-link">Find Recycling Centers</Link></li>
              <li><Link to="/user/wastesorting" className="footer-link">AI Waste Sorting Guide</Link></li>
              <li><Link to="/user/rewards" className="footer-link">Recycling Rewards</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="footer-link">NGO Partners</Link></li>
              <li><Link to="#" className="footer-link">Recycling Tips</Link></li>
              <li><Link to="#" className="footer-link">Green Initiatives</Link></li>
              <li><Link to="#" className="footer-link">Sustainability Resources</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-green-600 mt-0.5" />
                <span className="text-gray-600">123 Eco Street, Green City, EC1 2GR</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-green-600" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-green-600" />
                <span className="text-gray-600">info@recycleconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-green-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} RecycleConnect. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="footer-link">Privacy Policy</Link>
            <Link to="#" className="footer-link">Terms of Service</Link>
            <Link to="#" className="footer-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
