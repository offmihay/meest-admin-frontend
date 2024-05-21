import React, { useEffect } from "react";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface AlertNotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  type,
  message,
  description,
  placement = "topRight",
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    api[type]({
      message,
      description,
      placement,
    });
  }, [api, type, message, description, placement]);

  return <>{contextHolder}</>;
};

export default AlertNotification;
