import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAdminAuth } from "../context/AdminAuthProvider.jsx";
import Footer from "../components/Footer.jsx";

const AdminAuthLayout = () => {
  const { isAuthenticated } = useAdminAuth();
  return (
    <>
      <Navbar/>
      {isAuthenticated ?
        <Navigate to="/admin" /> :
        <div className="w-full h-full flex items-center justify-center max-sm:w-full">
          <Outlet />
        </div> 
      }
      <Footer/>
    </>
  );
};

export default AdminAuthLayout;
