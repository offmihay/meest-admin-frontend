import React from "react";
import { Button, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface LogoCardProps {
  logoSrc: string;
  companyName: string;
  onEdit: () => void;
  onDelete: () => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ logoSrc, companyName, onEdit, onDelete }) => {
  return (
    <div className="relative">
      <Card className="min-w-[180px] max-w-[250px]" hoverable>
        <div className="w-full h-[140px] mb-4 flex justify-center items-center">
          <img
            src={logoSrc}
            alt={`${companyName} logo`}
            className="object-contain mb-4 w-11/12 h-full"
          />
        </div>
        <div className="flex flex-wrap justify-around w-full gap-4">
          <Button onClick={onEdit} type="dashed" className="" icon={<EditOutlined />}>
            Редагувати
          </Button>
          <Button onClick={onDelete} type="dashed" danger icon={<DeleteOutlined />}>
            Видалити
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LogoCard;
