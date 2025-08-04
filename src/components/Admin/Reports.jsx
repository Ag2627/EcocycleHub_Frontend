
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Filter, Users, Clock, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchAllReports, updateReportStatus } from "@/redux/store/reportSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.report);

  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchAllReports());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateReportStatus({ id, status }));
  };

  const filteredReports = reports.filter((report) => {
    const locationMatch = report.location
      ?.toLowerCase()
      .includes(filterLocation.toLowerCase());
    const statusMatch =
      filterStatus === "all" || report.status === filterStatus;
    return locationMatch && statusMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "verified":
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "verified":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getReportTypeColor = (type) => {
    const colors = {
      "Environmental": "bg-emerald-100 text-emerald-800",
      "Safety": "bg-red-100 text-red-800",
      "Infrastructure": "bg-blue-100 text-blue-800",
      "Community": "bg-purple-100 text-purple-800",
      "Health": "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          </div>
          <p className="text-gray-600">Monitor and manage community reports efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === "verified").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Reports Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Reports Dashboard</span>
            </CardTitle>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Filter by location..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="pl-10 bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                </div>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="pl-10 bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-lg text-gray-600">Loading reports...</p>
                </div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No reports found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <div
                    key={report._id}
                    className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 space-y-3">
                          {/* Report Type and Status */}
                          <div className="flex items-center space-x-3">
                            <Badge className={`px-3 py-1 font-medium ${getReportTypeColor(report.type)}`}>
                              {report.type}
                            </Badge>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg border ${getStatusColor(report.status)}`}>
                              {getStatusIcon(report.status)}
                              <span className="text-sm font-medium capitalize">{report.status}</span>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium">{report.location}</span>
                          </div>
                          {/* image */}
                            {report.imageUrl && (
    <div className="mt-4">
      <img
        src={report.imageUrl}
        alt="Reported"
        className="w-full max-w-sm rounded-lg border border-gray-200 shadow-sm"
      />
    </div>
    )}

                          {/* User and Date */}
                          <div className="flex items-center space-x-1 text-sm text-gray-700">
  <Users className="h-4 w-4 text-blue-600" />
  <span className="font-semibold">{report.userId?.name}</span>
</div>

<div className="flex items-center space-x-1 text-sm text-gray-700">
  <Clock className="h-4 w-4 text-indigo-600" />
  <span className="font-medium">{new Date(report.createdAt).toLocaleDateString()}</span>
</div>

                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-700 font-semibold text-sm">
                              +{report.points} pts
                            </span>
                          </div>

                          <Select
                            value={report.status}
                            onValueChange={(value) => handleStatusUpdate(report._id, value)}
                          >
                            <SelectTrigger className="w-36 border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;
