import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();  //gives curent location
  // if (isAuthenticated && user?.email && !localStorage.getItem('userEmail')) {
  //   localStorage.setItem('userEmail', user.email);
  // }

  console.log(location.pathname, isAuthenticated);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/user/home" replace />;
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/signup")
    )
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/signup"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}

export default CheckAuth;