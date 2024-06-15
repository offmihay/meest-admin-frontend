import { Button, Layout } from "antd";
import DropdownPrimary from "../components/DropdownPrimary";

import { LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContextType } from "../utils/types/AuthContextType";
import useIsMobile from "../hooks/useIsMobile";

export interface HeaderProps {
  auth: AuthContextType | undefined;
  setIsCollapsed: () => void;
}

const Header = ({ auth, setIsCollapsed }: HeaderProps) => {
  const { Header } = Layout;

  const isMobile = useIsMobile();

  const profileDropdownItems = [
    // {
    //   label: "Settings",
    //   key: "0",
    //   icon: <SettingOutlined />,
    // },
    {
      label: "Log Out",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: () => auth?.logOut(),
    },
  ];

  const userIcon = (
    <div className="w-10 h-10 flex rounded-full bg-[#F5F1F1] justify-center items-center">
      <UserOutlined className="text-[22px]" />
    </div>
  );

  return (
    <Header
      className={`flex items-center justify-between bg-white gap-5 ${isMobile ? "!px-4" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={setIsCollapsed}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
      )}
      <div></div>
      <DropdownPrimary items={profileDropdownItems} baseElement={userIcon} />
    </Header>
  );
};

export default Header;
