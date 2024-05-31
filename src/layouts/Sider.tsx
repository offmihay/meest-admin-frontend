import React, { useState } from "react";
import {
  CloseOutlined,
  CompassOutlined,
  LineChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Button } from "antd";
import { useNavigate } from "react-router-dom";

export interface Props {
  isMobile: boolean;
  isCollapsed: boolean;
  setIsCollapsed: () => void;
}

const Sider = ({ isMobile, isCollapsed, setIsCollapsed }: Props) => {
  const { Sider } = Layout;
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState<string>(
    localStorage.getItem("siderMenuActive") || "dashboard"
  );

  const handleSetActiveMenu = (key: string) => {
    setActiveKey(key);
    localStorage.setItem("siderMenuActive", key);
    navigate(key);
  };

  const siderMenuData: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: React.createElement(LineChartOutlined),
      label: "Головна",
      onClick: () => {
        handleSetActiveMenu("dashboard");
      },
    },
    {
      key: "brands",
      icon: React.createElement(CompassOutlined),
      label: "Бренди & Одяг",
      onClick: () => {
        handleSetActiveMenu("brands");
      },
    },
    {
      key: "size-tables",
      icon: React.createElement(TableOutlined),
      label: "Розмірні таблиці",
      onClick: () => {
        handleSetActiveMenu("size-tables");
      },
    },
    {
      key: "conversions",
      icon: React.createElement(TableOutlined),
      label: "Таблиці конвертацій",
      onClick: () => {
        handleSetActiveMenu("conversions");
      },
    },
  ];

  return (
    <>
      <Sider
        width={300}
        className="!bg-white shadow-xl relative"
        trigger={null}
        style={{
          height: "100dvh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
        }}
        collapsedWidth="0"
        collapsible
        collapsed={isMobile ? isCollapsed : false}
        onClick={setIsCollapsed}
      >
        <div className="absolute top-0 w-full pl-6 pt-6">
          <a href="#">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/admin-logo.png`}
              className="w-7/12"
              alt=""
            />
          </a>
        </div>
        {isMobile && (
          <div className="absolute rounded-full right-4 top-4">
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={setIsCollapsed}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </div>
        )}

        <div className="h-[120px]"></div>
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={siderMenuData}
          selectedKeys={[activeKey]}
        />
      </Sider>
    </>
  );
};

export default Sider;
