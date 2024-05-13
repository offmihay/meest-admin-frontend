import { Input, Layout } from "antd";
import ProfileNav from "../elements/ProfileNav";
import { ReactNode } from "react";
// import { useAuth } from "../hooks/AuthHooks";
import {
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { AuthContextType } from "../types/AuthContextType";

export interface HeaderProps {
  isMobile: boolean;
  auth: AuthContextType;
}

export interface DropdownMenuItem {
  label: string;
  key: string;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: (event: any) => void;
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
      <ProfileNav items={profileDropdownItems} />
    </Header>
  );
};

export default Header;
