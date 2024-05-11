import React from "react";
import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Flex } from "antd";

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "0",
  },
  {
    label: "2nd menu item",
    key: "1",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const ProfileNav: React.FC = () => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    <a onClick={(e) => e.preventDefault()}>
      <Flex gap={5}>
        <div className="w-10 h-10 flex rounded-full bg-[#F5F1F1] justify-center items-center">
          <UserOutlined className="text-[22px]" />
        </div>
      </Flex>
    </a>
  </Dropdown>
);

export default ProfileNav;
