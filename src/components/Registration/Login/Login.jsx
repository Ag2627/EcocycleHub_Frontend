import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, clearAuthError } from "@/redux/store/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import { toast } from "sonner";
const initialState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [loginInfo, setLoginInfo] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const showToast = (title, description, variant = "default") => {
  toast[variant === "destructive" ? "error" : variant === "success" ? "success" : "message"](description, {
    description: title,
  });
};

    const { isLoading: authIsLoading, error: authError, isAuthenticated:isAuthenticated,user:user } = useSelector((state) => state.auth);
    const auth=useSelector((state) => state.auth);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (event) => {
        event.preventDefault();
        try{
          if (!loginInfo.email || !loginInfo.password) {
            showToast("Validation Error", "Please enter both email and password.", "destructive");
            return;
        }
        dispatch(loginUser(loginInfo)).then((data)=>{
            if (data?.payload?.success) {
                const role = data?.payload?.data?.role; // adjust according to actual payload structure
                const redirectPath = role === "admin" ? "/admin" : "/user/dashboard";
                showToast("Login Success", "Redirecting...", "success");
                navigate(redirectPath);
            } else {
                showToast("Login Error", data?.payload?.message || "Could not process login.", "destructive");
            }
        });
        }
        catch(error){
      console.log(error);
      showToast("Login Error", error.message || "Could not process login.", "destructive");
    };
        
}

  const handleGoogleLogin = async (googleUser) => {
    try {
        const decoded = jwtDecode(googleUser.credential); 
        dispatch(googleLogin({ email: decoded.email })).then((data) => {  
    
          if (data?.payload?.success) {
            
            const role = data?.payload?.data?.role; // adjust according to actual payload structure
            const redirectPath = role === "admin" ? "/admin" : "/user/dashboard";

            showToast("Google Login success", "Successful login", "success");
            navigate(redirectPath);
}
else {  
            showToast("Google Login Error", data?.payload?.message || "Could not process Google login.", "destructive");
          }
        });

      }
    catch(error){
      console.log(error);
      showToast("Google Login Error", error.message || "Could not process Google login.", "destructive");
    };
  }
  const handleGoogleFailure = () => {
    showToast("Google Login Failed", "Google authentication was unsuccessful.", "destructive");
  };



  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6fcf7] p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-md border">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-green-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c1.657 0 3 1.567 3 3.5S13.657 15 12 15s-3-1.567-3-3.5S10.343 8 12 8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-green-700">
            Welcome to <span className="text-blue-800 font-bold">EcoCycleHub</span>
          </h1>
          <p className="text-gray-600 text-sm">Sign in to continue</p>
        </div>
  
        <form className="space-y-6 pt-2" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={loginInfo.email}
                  onChange={handleChange}
                  className="pl-10 bg-green-50"
                  required
                />
              </div>
            </div>
  
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={loginInfo.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-green-50"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

         <Button type="submit" className="w-full bg-black text-white" disabled={authIsLoading}>
             {authIsLoading ? "Logging in..." : "Login"}
           </Button>
         </form>
         <div className="relative flex items-center justify-center">
           <Separator className="absolute w-full" />
           <span className="relative bg-white px-2 text-sm text-gray-500">Or continue with</span>
         </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleFailure} />
        </div>
  
        <p className="text-center text-xs text-gray-500 pt-4">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-green-700 underline">Terms of Service</a> and{" "}
          <a href="/privacy" className="text-green-700 underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
  
}  

export default LoginPage;

