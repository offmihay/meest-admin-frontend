import { Routes as Router, Route, Navigate } from "react-router-dom";

import Login from "./components/Pages/Login";
import Dashboard from "./components/Pages/Dashboard";
import PrivateRoute from "./components/hooks/PrivateRoute";

const Routes = () => {
  return (
    <Router>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="*" element={<Navigate to="dashboard" />}></Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Router>
  );
};

export default Routes;
