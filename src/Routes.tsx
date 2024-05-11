import { Routes as Router, Route, Navigate } from "react-router-dom";

import Login from "./components/Pages/Login";
import Dashboard from "./components/Pages/Dashboard";
import PrivateRoute from "./components/Hooks/PrivateRoute";

const Routes = () => {
  return (
    <Router>
      <Route path="meest-admin/login" element={<Login />} />
      <Route path="meest-admin/" element={<Dashboard />} />
      <Route element={<PrivateRoute />}>
        <Route path="meest-admin/*" element={<Navigate to="/meest-admin/dashboard" />}></Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="meest-admin/dashboard" element={<Dashboard />} />
      </Route>
    </Router>
  );
};

export default Routes;
