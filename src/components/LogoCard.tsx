import React from "react";
import { Button, Card, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

interface LogoCardProps {
  logoSrc: string;
  companyName: string;
  onEdit: () => void;
  onDelete: () => void;
}

const LogoCard: React.FC<LogoCardProps> = ({
  logoSrc,
  companyName,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="min-w-[180px] max-w-[250px]" hoverable>
      <div className="w-full h-[140px] mb-4 flex justify-center items-center">
        <img
          src={logoSrc}
          alt={`${companyName} logo`}
          className="object-contain mb-4 w-11/12 h-full"
        />
      </div>
      <div className="flex flex-wrap justify-around w-full gap-4">
        <Button
          onClick={onEdit}
          type="dashed"
          className=""
          icon={<EditOutlined />}
        >
          Редагувати
        </Button>
        <Popconfirm
          title="Видалити бренд"
          description="Ви впевнені що хочете видалити цей бренд? Видаляючи бренд, ви також видаляєте всі дані які були збережені за цим брендом. Ці дії незворотні! "
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={onDelete}
          okText="Так"
          cancelText="Скасувати"
          overlayClassName="w-[300px]"
        >
          <Button type="dashed" danger icon={<DeleteOutlined />}>
            Видалити
          </Button>
        </Popconfirm>
      </div>
    </Card>
  );
};

export default LogoCard;
