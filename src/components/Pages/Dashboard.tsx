import { useEffect, useState } from "react";

import { Button, Layout } from "antd";
import Header from "../Layouts/Header";
import Sider from "../Layouts/Sider";
import { useAuth } from "../hooks/AuthProvider";

import { fetchJson } from "../hooks/Api";

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

  async function getBrands() {
    const token = localStorage.getItem("token");
    if (token) {
      token.toString();
      try {
        const data = await fetchJson("all-brands", token);
        console.log("Received data:", data);
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    }
  }

  return (
    <Layout
      style={{ background: "white", height: "100dvh", overflow: "hidden" }}
    >
      <Sider isMobile={isMobile} />
      <Layout>
        <Header isMobile={isMobile} />
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Button onClick={() => auth.logOut()}>logout</Button>
            <Button onClick={() => getBrands()}>
              get brands (works only with Authorization)
            </Button>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
