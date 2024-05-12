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

  const [usersData, setUsersData] = useState<any[]>([]);

  async function getUsers() {
    const token = localStorage.getItem("token");
    try {
      const data = await fetchJson("api/all-users", token);
      setUsersData(data);
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  }

  return (
    <Layout
      style={{ background: "white", height: "100dvh", overflow: "hidden" }}
    >
      <Sider isMobile={isMobile} />
      <Layout>
        <Header isMobile={isMobile} />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Button onClick={() => auth.logOut()}>logout</Button>
          <Button onClick={() => getUsers()}>
            get all users (need Authorization)
          </Button>
          <div>
            {usersData &&
              usersData.map((obj, index) => (
                <>
                  <p key={index}>
                    {Object.keys(obj).map((key, i) => (
                      <>
                        <span key={i}>
                          <span className="text-[#FF0000]">{key}</span>:{" "}
                          {obj[key]}
                          {i !== Object.keys(obj).length - 1 ? ", " : ""}
                        </span>
                        <br></br>
                      </>
                    ))}
                  </p>
                  <br></br>
                  <br></br>
                </>
              ))}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
