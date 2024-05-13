import { useEffect, useState } from "react";

import { Layout } from "antd";
import Header from "../layouts/Header";
import Sider from "../layouts/Sider";
import { useAuth } from "../hooks/AuthHooks";

const { Content } = Layout;

const Dashboard = () => {
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
        ></Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
