import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/redux/store/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // logout API + localStorage clear
      navigate("/auth/login"); // redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200 z-10 flex items-center justify-between px-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg font-medium hover:scale-105 transition"
      >
        Logout
      </button>
    </header>
  );
}
