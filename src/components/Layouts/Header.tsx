import { Input, Layout } from "antd";
import DropdownPrimary from "../elements/DropdownPrimary";

import {
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContextType } from "../types/AuthContextType";

export interface HeaderProps {
  isMobile: boolean;
  auth: AuthContextType;
}

const Header = ({ isMobile, auth }: HeaderProps) => {
  const { Header } = Layout;

  const profileDropdownItems = [
    {
      label: "Settings",
      key: "0",
      icon: <SettingOutlined />,
    },
    {
      label: "Log Out",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: () => auth.logOut(),
    },
  ];

  const userIcon = (
    <div className="w-10 h-10 flex rounded-full bg-[#F5F1F1] justify-center items-center">
      <UserOutlined className="text-[22px]" />
    </div>
  );

  return (
    <Header
      className={`flex items-center justify-between bg-white gap-5 ${
        isMobile ? "!px-4" : ""
      }`}
    >
      <Input
        placeholder="Пошук"
        prefix={<SearchOutlined className="text-[20px]" />}
        style={{ width: "300px", borderRadius: 100 }}
      />
      <DropdownPrimary items={profileDropdownItems} baseElement={userIcon} />
    </Header>
  );
};

export default Header;
