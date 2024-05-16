import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import HomepageLayout from "../layouts/HomepageLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="*" element={<HomepageLayout />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
