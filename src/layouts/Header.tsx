import { Button, Layout } from "antd";
import DropdownPrimary from "../components/DropdownPrimary";
// Input
import { useNavigate } from "react-router-dom";

import {
  LogoutOutlined,
  MenuOutlined,
  // SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthContextType } from "../utils/types/AuthContextType";
import useIsMobile from "../hooks/useIsMobile";
// import React from "react";

export interface HeaderProps {
  auth: AuthContextType | undefined;
  setIsCollapsed: () => void;
}

const Header = ({ auth, setIsCollapsed }: HeaderProps) => {
  const { Header } = Layout;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const profileDropdownItems = [
    {
      label: "Log Out",
      key: "1",
      icon: <LogoutOutlined />,
      onClick: () => auth?.logOut(),
    },
  ];
  // bg-[#F5F1F1]
  const userIcon = (
    <div className="w-10 rounded-full bg-[#F5F1F1] mr-2 h-10 flex justify-center items-center">
      <UserOutlined className="text-[22px]" />
    </div>
  );

  return (
    <Header
      className={`z-[2] md:z-[3]  justify-normal md:justify-center border-solid relative border-0 border-b border-gray-200 flex items-center bg-white  !px-0`}
      style={{
        position: "fixed",

        top: 0,
        // zIndex: 3,
        width: "100%",
        height: "50px",
        display: "flex",
        // alignItems: "center",
        // alignItems: "center",

        // justifyContent: "center",
      }}
    >
      {!isMobile && (
        <div className="absolute left-0  pl-5 ">
          <a
            className="flex justify-center align-middle items-center"
            onClick={() => navigate("")}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/images/admin-logo.png`}
              className="h-6"
              alt=""
            />
            <div
              style={{
                fontFamily:
                  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
              }}
              className="leading-none ml-3 font-semibold text-mainblue text-xl"
            >
              Admin panel
            </div>
          </a>
        </div>
      )}
      {isMobile && (
        <div className="absolute left-9 flex justify-center align-middle items-center pl-5 ">
          {/*<a onClick={() => navigate("")}>*/}
          <img
            src={`${import.meta.env.BASE_URL}assets/images/admin-logo-mobile.png`}
            className="h-6"
            alt=""
          />
          <div
            style={{
              fontFamily:
                "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
            }}
            className="leading-none ml-3 font-semibold text-mainblue text-xl"
          >
            Admin panel
          </div>
          {/*</a>*/}
        </div>
      )}
      {isMobile && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={setIsCollapsed}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            paddingRight: 10,
            paddingLeft: 5,
          }}
        />
      )}
      {/*<Input*/}
      {/*    placeholder="Пошук"*/}
      {/*    className="hidden md:inline-flex rounded-md"*/}
      {/*    prefix={<SearchOutlined className="text-[20px] mr-2 "/>}*/}
      {/*    style={{width: "300px", height: "70%", color: "#8f8f8f"}}*/}
      {/*/>*/}
      <DropdownPrimary items={profileDropdownItems} baseElement={userIcon} />
    </Header>
  );
};

export default Header;
