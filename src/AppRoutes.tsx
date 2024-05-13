import { Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import PrivateRoute from "./components/hooks/PrivateRoute";
import HomepageLayout from "./components/layouts/HomepageLayout";

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
