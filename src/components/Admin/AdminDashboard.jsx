import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, FileText, CheckCircle } from "lucide-react";
import axios from "axios";
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    completedReports: 0,
  });


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reports/dashboard-stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8" />,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+12%"
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: <FileText className="h-8 w-8" />,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      change: "+8%"
    },
    {
      title: "Completed Reports",
      value: stats.completedReports,
      icon: <CheckCircle className="h-8 w-8" />,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      change: "+15%"
    }
  ];

  return (
     <main className="p-8 space-y-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome back, Admin 👋
            </h2>
            <p className="text-gray-600">Here's what's happening with your platform today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <Card key={card.title} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${card.bgGradient} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-white/20 blur-xl"></div>
                    <div className="flex items-start justify-between relative">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                        <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm font-medium text-green-600">{card.change}</span>
                        </div>
                      </div>
                      <div className={`bg-gradient-to-br ${card.gradient} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {card.icon}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          
        </main>
  );
}
