import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthProvider.jsx";
import RootNavbar from "../components/RootNavbar.jsx";

const UserAuthLayout = () => {
  const { isUserAuthenticated } = useUserAuth();
  return (
    <>
      <RootNavbar/>
      {!isUserAuthenticated ? (
        <div className="w-full h-full flex items-center justify-center max-sm:w-full bg-dark-6">
          <Outlet />
        </div>
      ) : (
        <Navigate to={`/`} />
      )}
    </>
  );
};

export default UserAuthLayout;
