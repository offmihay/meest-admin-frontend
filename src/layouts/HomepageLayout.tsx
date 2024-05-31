import { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/content-pages/Dashboard/Dashboard";
import Brands from "../pages/content-pages/Brands/Brands";
import SizeTables from "../pages/content-pages/Sizetable/SizeTables";
import useIsMobile from "../hooks/useIsMobile";

const { Content } = Layout;

const HomepageLayout = () => {
  const auth = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isMobile = useIsMobile();

  return (
    <Layout hasSider style={{ background: "white", minHeight: "100dvh" }}>
      <Sider isCollapsed={isCollapsed} setIsCollapsed={() => setIsCollapsed(!isCollapsed)} />
      <Layout style={{ marginLeft: isMobile ? 0 : 300 }}>
        <Header auth={auth} setIsCollapsed={() => setIsCollapsed(!isCollapsed)} />
        <Content
          style={{
            padding: isMobile ? 10 : 24,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path="" element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="brands" element={<Brands />} />
            <Route path="size-tables" element={<SizeTables />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageLayout;
