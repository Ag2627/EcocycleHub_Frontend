import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, LogOut } from "lucide-react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/store/authSlice"; // Update path if needed

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const url = "http://localhost:5173";
  const navLinks = [
    { name: "Report Waste", path: `${url}/user/report` },
    { name: "My Reports", path: `${url}/user/my-reports` },
    { name: "Find Centers", path: `${url}/user/centres` },
    { name: "Waste Guide", path: `${url}/user/wastesorting` },
    { name: "Rewards", path: `${url}/user/rewards` },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur shadow-md py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
          <Leaf size={28} className="mr-2" />
          RecycleConnect
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-800 hover:text-green-700 font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} className="text-gray-800" /> : <Menu size={24} className="text-gray-800" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-white transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-20 px-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-800 text-lg font-medium border-b pb-2 border-gray-200"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
