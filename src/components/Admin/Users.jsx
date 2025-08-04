import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/redux/store/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Award, BarChart3 } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <User className="h-8 w-8" />
              User Management
            </CardTitle>
            <p className="text-blue-100 mt-2">Manage and monitor user accounts</p>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : user.status === "flagged"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs font-medium"
                            >
                              {user.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                {user.reportsCount} reports
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                              <Award className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                {user.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <div className="text-center py-16">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Users will appear here once they're available.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;