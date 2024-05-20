import { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import { useAuth } from "../hooks/useAuth";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/content-pages/Dashboard/Dashboard";
import Brands from "../pages/content-pages/Brands/Brands";
import SizeTables from "../pages/content-pages/Sizetable/SizeTables";

const { Content } = Layout;

const HomepageLayout = () => {
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  return (
    <Layout hasSider style={{ background: "white" }}>
      <Sider
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={() => setIsCollapsed(!isCollapsed)}
      />
      <Layout style={{ marginLeft: isMobile ? 0 : 300 }}>
        <Header
          isMobile={isMobile}
          auth={auth}
          setIsCollapsed={() => setIsCollapsed(!isCollapsed)}
        />
        <Content
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          <Routes>
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
