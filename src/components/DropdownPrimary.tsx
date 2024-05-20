import React from "react";
import { Dropdown, Flex } from "antd";
import { ReactNode } from "react";

export interface DropdownPrimaryProps {
  items: {
    label: string;
    key: string;
    disabled?: boolean;
    icon?: ReactNode;
    onClick?: (event: any) => void;
  }[];
  baseElement: ReactNode;
}

const DropdownPrimary: React.FC<DropdownPrimaryProps> = ({
  items,
  baseElement,
}) => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    <a onClick={(e) => e.preventDefault()}>
      <Flex gap={5}>{baseElement}</Flex>
    </a>
  </Dropdown>
);

export default DropdownPrimary;
