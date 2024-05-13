import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Flex } from "antd";
import { DropdownMenuItem } from "../layouts/Header";

interface ProfileNavProps {
  items: DropdownMenuItem[];
}

const ProfileNav: React.FC<ProfileNavProps> = ({ items }) => (
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
