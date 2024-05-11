import React from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";

export interface Props {
  isMobile: boolean;
}

const Sider = ({ isMobile }: Props) => {
  const { Sider } = Layout;

  const items: MenuProps["items"] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);

      return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subnav ${key}`,

        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    }
  );

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
                src={`${import.meta.env.BASE_URL}/assets/images/admin-logo.png`}
                className="w-6/12"
                alt=""
              />
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}/assets/images/admin-logo-mobile.png`}
                className="w-[40px]"
                alt=""
              />
            )}
          </a>
        </div>

        <div className="h-[120px]"></div>
        <Menu mode="inline" style={{ borderRight: 0 }} items={items} />
      </Sider>
    </>
  );
};

export default Sider;
