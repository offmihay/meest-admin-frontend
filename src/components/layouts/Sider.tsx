import React from "react";
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

  const siderMenuData: MenuProps["items"] = [
    {
      key: "1",
      icon: React.createElement(LineChartOutlined),
      label: "Головна",
      onClick: () => navigate("/dashboard"),
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
          onClick: () => navigate("/brands"),
        },
        {
          key: "sub2",
          icon: React.createElement(CloseCircleOutlined),
          label: "Видалити бренд",
        },
        {
          key: "sub3",
          icon: React.createElement(SettingOutlined),
          label: "Редагувати інформацію",
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
        },
        {
          key: "sub5",
          icon: React.createElement(AppstoreOutlined),
          label: "data",
        },
        {
          key: "sub6",
          icon: React.createElement(SettingOutlined),
          label: "data",
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
        },
        {
          key: "sub8",
          icon: React.createElement(AppstoreOutlined),
          label: "data",
        },
        {
          key: "sub9",
          icon: React.createElement(SettingOutlined),
          label: "data",
        },
      ],
    },
  ];

  return (
    <>
      <Sider
        width={300}
        className="!bg-white shadow-xl relative sider"
        trigger={null}
        collapsible
        collapsed={isMobile}
      >
        <div className="absolute top-0 w-full m-3 p-2">
          <a href="#">
            {!isMobile ? (
              <img
                src={`${import.meta.env.BASE_URL}assets/images/admin-logo.png`}
                className="w-6/12"
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
          selectedKeys={["1"]}
        />
      </Sider>
    </>
  );
};

export default Sider;
