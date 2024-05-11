import { SearchOutlined } from "@ant-design/icons";
import { Input, Layout } from "antd";
import ProfileNav from "../Elements/ProfileNav";

export interface Props {
  isMobile: boolean;
}

const Header = ({ isMobile }: Props) => {
  const { Header } = Layout;

  return (
    <Header
      className={`flex items-center justify-between bg-white gap-5 ${isMobile ? "!px-4" : ""}`}
    >
      <Input
        placeholder="Пошук"
        prefix={<SearchOutlined className="text-[20px]" />}
        style={{ width: "300px", borderRadius: 100 }}
      />
      <ProfileNav />
    </Header>
  );
};

export default Header;
