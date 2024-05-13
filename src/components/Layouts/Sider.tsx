import React from "react";
import {
  AppstoreOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";

export interface Props {
  isMobile: boolean;
}

const Sider = ({ isMobile }: Props) => {
  const { Sider } = Layout;

  const siderMenuData: MenuProps["items"] = [
    {
      key: "1",
      icon: React.createElement(AppstoreOutlined),
      label: "Управління брендами",
      children: [
        {
          key: "sub1",
          icon: React.createElement(PlusOutlined),
          label: "Додати бренд",
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
        <Menu mode="inline" style={{ borderRight: 0 }} items={siderMenuData} />
      </Sider>
    </>
  );
};

export default Sider;
