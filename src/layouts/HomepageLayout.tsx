import { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sider from "./Sider";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Route, Routes } from "react-router-dom";
import Brands from "../pages/content-pages/Brands/Brands";
import SizeTables from "../pages/content-pages/Sizetable/SizeTables";
import useIsMobile from "../hooks/useIsMobile";
import SizeConversions from "../pages/content-pages/SizeConversions/SizeConversions";

const { Content } = Layout;

const HomepageLayout = () => {
  const auth = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const SetLocalStorageAndRedirect = () => {
    useEffect(() => {
      localStorage.setItem("siderMenuActive", "brands");
    }, []);

    return <Navigate to="/brands" />;
  };

  return (
    <Layout hasSider style={{ background: "white", minHeight: "100dvh" }}>
      <Header auth={auth} setIsCollapsed={() => setIsCollapsed(!isCollapsed)} />
      <Sider
        isCollapsed={isCollapsed}
        setIsCollapsed={() => setIsCollapsed(!isCollapsed)}
      />

      <Layout style={{ marginTop: 50, marginLeft: isMobile ? 0 : 300 }}>
        <Content
          style={{
            padding: isMobile ? 10 : 24,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path="/" element={<SetLocalStorageAndRedirect />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="brands" element={<Brands />} />
            <Route path="size-tables" element={<SizeTables />} />
            <Route path="conversions" element={<SizeConversions />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomepageLayout;
