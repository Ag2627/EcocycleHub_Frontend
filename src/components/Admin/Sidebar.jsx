import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Store, MessageCircle , Coins} from "lucide-react";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: <LayoutDashboard />, path: "/admin" },
    { label: "Users", icon: <Users />, path: "/admin/users" },
    { label: "Reports", icon: <FileText />, path: "/admin/reports" },
    { label: "Manage Rewards", icon: <Coins/>, path: "/admin/managerewards"},
    {label:"NGO's",icon:<Store/>,path:"/admin/ngos"},
    {label:"Reminders",icon:<MessageCircle/>,path:"/admin/reminders"}
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white fixed shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          WasteAdmin
        </h2>
        <p className="text-slate-400 text-sm mt-1">Management Portal</p>
      </div>
      
      <nav className="flex flex-col gap-2 px-4 mt-6">
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105" 
                  : "hover:bg-slate-700/50 hover:transform hover:translate-x-1"
              }`
            }
          >
            <span className={`transition-transform duration-200 ${
              ({ isActive }) => isActive ? "text-white" : "text-slate-400 group-hover:text-white group-hover:scale-110"
            }`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
