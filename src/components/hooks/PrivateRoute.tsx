import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthHooks";

const PrivateRoute = () => {
  const authContext = useAuth();

  return authContext?.userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
