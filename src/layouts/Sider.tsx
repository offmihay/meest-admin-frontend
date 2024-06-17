import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  CompassOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, Button } from "antd";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

export interface Props {
  isCollapsed: boolean;
  setIsCollapsed: () => void;
}

const Sider = ({ isCollapsed, setIsCollapsed }: Props) => {
  const { Sider } = Layout;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [activeKey, setActiveKey] = useState<string>(
    localStorage.getItem("siderMenuActive") || "brands",
  );

  useEffect(() => {
    handleSetActiveMenu(localStorage.getItem("siderMenuActive") || "brands");
  }, []);

  const handleSetActiveMenu = (key: string) => {
    setActiveKey(key);
    localStorage.setItem("siderMenuActive", key);
    navigate(key);
  };

  const siderMenuData: MenuProps["items"] = [
    // {
    //   key: "dashboard",
    //   icon: React.createElement(LineChartOutlined),
    //   label: "Головна",
    //   onClick: () => {
    //     handleSetActiveMenu("dashboard");
    //   },
    // },
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
        className="!bg-white relative border-solid border-0 border-r border-gray-200"
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

        <div className="h-[50px]"></div>
        <Menu
          mode="inline"
          style={{ borderRight: 0, padding: 10 }}
          items={siderMenuData}
          selectedKeys={[activeKey]}
        />
      </Sider>
    </>
  );
};

export default Sider;
