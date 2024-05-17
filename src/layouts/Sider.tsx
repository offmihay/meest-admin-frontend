import React, { useState } from "react";
import {
  ApartmentOutlined,
  AppstoreOutlined,
  CloseCircleOutlined,
  CompassOutlined,
  LineChartOutlined,
  PlusOutlined,
  SettingOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

export interface Props {
  isMobile: boolean;
}

const Sider = ({ isMobile }: Props) => {
  const { Sider } = Layout;
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState<string>(
    localStorage.getItem("siderMenuActiveKey") || "1"
  );

  const handleSetActiveKey = (key: string) => {
    setActiveKey(key);
    localStorage.setItem("siderMenuActiveKey", key);
  };

  const siderMenuData: MenuProps["items"] = [
    {
      key: "1",
      icon: React.createElement(LineChartOutlined),
      label: "Головна",
      onClick: () => {
        handleSetActiveKey("1");
        navigate("/dashboard");
      },
    },
    {
      key: "2",
      icon: React.createElement(CompassOutlined),
      label: "Управління брендами",
      children: [
        {
          key: "sub1",
          icon: React.createElement(PlusOutlined),
          label: "Додати бренд",
          onClick: () => {
            navigate("/brands");
            handleSetActiveKey("sub1");
          },
        },
        {
          key: "sub2",
          icon: React.createElement(CloseCircleOutlined),
          label: "Видалити бренд",
          onClick: () => {
            navigate("/brands");
            handleSetActiveKey("sub2");
          },
        },
        {
          key: "sub3",
          icon: React.createElement(SettingOutlined),
          label: "Редагувати інформацію",
          onClick: () => {
            handleSetActiveKey("sub3");
          },
        },
      ],
    },
    {
      key: "3",
      icon: React.createElement(TableOutlined),
      label: "Розмірні таблиці",
      children: [
        {
          key: "sub4",
          icon: React.createElement(ApartmentOutlined),
          label: "data",
          onClick: () => {
            navigate("/size-tables");
            handleSetActiveKey("sub4");
          },
        },
        {
          key: "sub5",
          icon: React.createElement(AppstoreOutlined),
          label: "data",
          onClick: () => {
            handleSetActiveKey("sub5");
          },
        },
        {
          key: "sub6",
          icon: React.createElement(SettingOutlined),
          label: "data",
          onClick: () => {
            handleSetActiveKey("sub6");
          },
        },
      ],
    },
    {
      key: "4",
      icon: React.createElement(TableOutlined),
      label: "Таблиці конвертацій",
      children: [
        {
          key: "sub7",
          icon: React.createElement(ApartmentOutlined),
          label: "data",
          onClick: () => {
            handleSetActiveKey("sub7");
          },
        },
        {
          key: "sub8",
          icon: React.createElement(AppstoreOutlined),
          label: "data",
          onClick: () => {
            handleSetActiveKey("sub8");
          },
        },
        {
          key: "sub9",
          icon: React.createElement(SettingOutlined),
          label: "data",
          onClick: () => {
            handleSetActiveKey("sub9");
          },
        },
      ],
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
        }}
      >
        <div className="absolute top-0 w-full p-6">
          <a href="#">
            {!isMobile ? (
              <img
                src={`${import.meta.env.BASE_URL}assets/images/admin-logo.png`}
                className="w-7/12"
                alt=""
              />
            ) : (
              <img
                src={`${
                  import.meta.env.BASE_URL
                }assets/images/admin-logo-mobile.png`}
                className="w-[40px]"
                alt=""
              />
            )}
          </a>
        </div>

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
