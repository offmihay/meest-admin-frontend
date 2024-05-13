import { Routes as Router, Route, Navigate } from "react-router-dom";

import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import PrivateRoute from "./components/hooks/PrivateRoute";

const Routes = () => {
  return (
    <Router>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="*" element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Router>
  );
};

export default Routes;
