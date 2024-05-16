import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = () => {
  const authContext = useAuth();

  return authContext?.userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
