import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/redux/store/authSlice"; 

import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import Home from './components/User/Home/Home';
import RewardsPage from './components/User/Rewards/RewardsPage';
import TransactionsPage from './components/User/Rewards/TransactionsPage'
import LoginPage from './components/Registration/Login/Login';
import SignupPage from './components/Registration/Signup/Signup';
import GetStarted from './components/Registration/GetStarted';
import ReportPage from './components/report/page';
import WasteSorting from './components/SortingGuide/WasteSorting';

import RecyclingMap from './components/RecyclingCenters/RecyclingMap';

import MyReports from "./components/report/MyReports";
import NotFoundPage from "./components/common/NotFoundPage";
 import { Toaster } from 'sonner'; 
import AdminLayout from "./components/Admin/AdminLayout";
import ManageRewards from "./components/Admin/ManageRewards";
import UnauthPage from "./components/common/UnauthPage";
import Reports from "./components/Admin/Reports";
import Users from "./components/Admin/Users";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RecyclingCenters from "./components/RecyclingCenters/RecyclingMap";
import AdminNGOManager from "./components/Admin/NGOs";
import AdminReminders from "./components/Admin/AdminReminders";

// Protected Route: Only accessible if authenticated

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useSelector(state => state.auth);
  const location = useLocation();

  if (isLoading) return <div>Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />;
  if (user?.role !== "admin") return <Navigate to="/unauth-page" replace />;

  return <Outlet />;
};

const UserRoute = () => {
  const { isAuthenticated, isLoading, user } = useSelector(state => state.auth);
  const location = useLocation();

  if (isLoading) return <div>Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location }} replace />;
  if (user?.role !== "user") return <Navigate to="/unauth-page" replace />;

  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  if (isLoading) return <div>Loading session...</div>;
  if (isAuthenticated) return <Navigate to="/user/dashboard" replace />;
  return <Outlet />;
};


const router = createBrowserRouter([
    { path: '/', element: <GetStarted /> },
    {
        element: <PublicOnlyRoute />,
        children: [
            { path: '/auth/login', element: <LoginPage /> },
            { path: '/auth/signup', element: <SignupPage /> },
        ]
    },
     {
    element: <UserRoute />, // only logged-in users with role "user"
    children: [
      { path: 'user/dashboard', element: <Home /> },
      { path: 'user/report', element: <ReportPage /> },
      { path: 'user/my-reports', element: <MyReports /> },
      { path: 'user/wastesorting', element: <WasteSorting /> },
      { path: 'user/rewards', element: <RewardsPage /> },
      { path: 'user/centres', element: <RecyclingMap /> },
      { path: 'user/transactions', element: <TransactionsPage /> },
      {path:'user/recycling-centers',element:<RecyclingCenters/>}
    ]
  },
  {
    element: <AdminRoute />, // only admins
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
           // You might want a UserLayout component here to wrap these user routes
            // { path: 'user', element: <UserLayout />, children: [ ... ]}
          { index: true, element: <AdminDashboard/> }, // replace with your dashboard
          { path: 'users', element: <Users /> },
          { path: 'reports', element: <Reports /> },
          { path: 'managerewards', element: <ManageRewards /> },
          {path:'ngos',element:<AdminNGOManager/>},
          {path:'reminders',element:<AdminReminders/>},
        ]
      }
    ]
  },
  {path: '/unauth-page', element: <UnauthPage />},
  { path: '*', element: <NotFoundPage /> }// Good to have a 404 page
]);

function App() {
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);
    if (isLoading) return <div>Checking session, please wait...</div>;

    return (
        <>
            <Toaster richColors position="top-right" />
            <RouterProvider router={router} />
        </>
    );
}

export default App;