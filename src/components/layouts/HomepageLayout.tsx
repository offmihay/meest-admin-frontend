import { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import { useAuth } from "../hooks/AuthHooks";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/content-pages/Dashboard";
import Brands from "../pages/content-pages/Brands";
import SizeTables from "../pages/content-pages/SizeTables";

const { Content } = Layout;

const HomepageLayout = () => {
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    <Layout
      style={{ background: "white", height: "100dvh", overflow: "hidden" }}
    >
      <Sider isMobile={isMobile} />
      <Layout>
        <Header isMobile={isMobile} auth={auth} />
        <Content
          style={{
            padding: 24,
            margin: 0,
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
