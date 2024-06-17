import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Button,
  notification,
  Dropdown,
  Checkbox,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { SizeTableData } from "../utils/types/SizeTableData";

interface TableDataWithKey extends SizeTableData {
  key: string;
  isNew?: boolean;
  [key: string]: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: TableDataWithKey;
  possibleSizeValues: string[];
  selectedSizeSystem: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  inputType,
  children,
  possibleSizeValues,
  selectedSizeSystem,
  ...restProps
}) => {
  const inputNode =
    dataIndex === "size_value" ? (
      <Select>
        <Select.Option value={null}>NULL</Select.Option>
        {possibleSizeValues.map((value) => (
          <Select.Option key={value} value={value}>
            {value}
          </Select.Option>
        ))}
      </Select>
    ) : inputType === "number" ? (
      <InputNumber className="  " />
    ) : (
      <Input />
    );

  const rules: any[] = [
    {
      required: dataIndex === "size_value",
      message: "",
    },
    {
      validator: (_: any, value: any) => {
        if (
          dataIndex === "size_value" &&
          !possibleSizeValues.includes(value) &&
          value !== null
        ) {
          return Promise.reject(new Error("Invalid size value"));
        }
        return Promise.resolve();
      },
    },
  ];

  if (dataIndex !== "size_value") {
    rules.push({
      validator: (_: any, value: any) => {
        if (value >= 0 && value <= 300) {
          return Promise.resolve();
        }
        return Promise.reject();
      },
    });
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC<{
  data: TableDataWithKey[];
  setData: React.Dispatch<React.SetStateAction<TableDataWithKey[]>>;
  possibleSizeValues: string[];
  selectedSizeSystem: string;
  setSelectedSizeSystem: React.Dispatch<React.SetStateAction<string>>;
  uniqClothId: number;
}> = ({
  data,
  setData,
  possibleSizeValues,
  selectedSizeSystem,
  uniqClothId,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [newRecordKeys, setNewRecordKeys] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(() => {
    const storedShowAll = localStorage.getItem("showAll");
    return storedShowAll ? JSON.parse(storedShowAll) : true;
  });

  const filledBodyParts = [
    "height",
    "head_length",
    "chest_length",
    "waist_length",
    "hip_length",
    "pants_length",
    "foot_length",
  ].filter((col) =>
    data.some((item) => item[col] !== null && item[col] !== ""),
  );

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    return new Set([
      "height",
      "head_length",
      "chest_length",
      "waist_length",
      "hip_length",
      "pants_length",
      "foot_length",
      "size_value",
      "operation",
    ]);
  });

  useEffect(() => {
    if (
      localStorage.getItem("showAll") == "true" ||
      filledBodyParts.length == 0
    ) {
      setVisibleColumns(
        new Set([
          "height",
          "head_length",
          "chest_length",
          "waist_length",
          "hip_length",
          "pants_length",
          "foot_length",
          "size_value",
          "operation",
        ]),
      );
    } else {
      setVisibleColumns(new Set(["size_value", ...filledBodyParts]));
    }
  }, [data]);

  useEffect(() => {
    // Reset size values to null when selectedSizeSystem changes
    const newData = data.map((item) => ({
      ...item,
      size_value:
        item.size_system === selectedSizeSystem ? item.size_value : null,
    }));
    setData(newData);
  }, [selectedSizeSystem]);

  const isEditing = (record: TableDataWithKey) => record.key === editingKey;

  const edit = (record: Partial<TableDataWithKey> & { key: string }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (newRecordKeys.has(editingKey)) {
      setData(data.filter((item) => item.key !== editingKey));
      newRecordKeys.delete(editingKey);
      setNewRecordKeys(new Set(newRecordKeys));
    }
    setEditingKey("");
  };

  const openNotification = (
    type: "success" | "info" | "warning" | "error",
    message: string,
    description?: string,
  ) => {
    notification[type]({
      message,
      description,
      placement: "top",
    });
  };

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as TableDataWithKey;

      if (row.size_value === null) {
        throw new Error("Size value cannot be null");
      }

      const valid = Object.keys(row).some(
        (field) =>
          field !== "size_value" &&
          field !== "key" &&
          field !== "isNew" &&
          row[field] !== null,
      );

      if (!valid) {
        throw new Error(
          "At least one parameter must be filled in, except Size Value",
        );
      }

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, key: item.key });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push({ ...row, key });
        setData(newData);
        setEditingKey("");
      }
      newRecordKeys.delete(key);
      setNewRecordKeys(new Set(newRecordKeys));
    } catch (errInfo) {
      openNotification(
        "error",
        "Не правильно введені дані",
        "Хоча б один параметр має бути заповнений, окрім Size Value. Для Size Value допустимі значення можна переглянути в таблиці конвертацій",
      );
    }
  };

  const addNewRow = () => {
    const key = `new_${new Date().getTime()}`;
    const newRow: TableDataWithKey = {
      key,
      uniq_cloth_id: uniqClothId,
      height: null,
      head_length: null,
      chest_length: null,
      waist_length: null,
      hip_length: null,
      pants_length: null,
      foot_length: null,
      size_system: selectedSizeSystem,
      size_value: null, // set initial value to null
      isNew: true,
    };
    setData([...data, newRow]);
    edit(newRow);
    newRecordKeys.add(key);
    setNewRecordKeys(new Set(newRecordKeys));
  };

  const deleteRow = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    newRecordKeys.delete(key);
    setNewRecordKeys(new Set(newRecordKeys));
  };

  const handleColumnVisibilityChange = (key: string, checked: boolean) => {
    if (key === "operation") return;
    const newVisibleColumns = new Set(visibleColumns);
    if (checked) {
      newVisibleColumns.add(key);
    } else {
      newVisibleColumns.delete(key);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const handleShowAllColumns = (checked: boolean) => {
    setShowAll(checked);
    localStorage.setItem("showAll", JSON.stringify(checked));
    if (checked) {
      setVisibleColumns(
        new Set([
          "height",
          "head_length",
          "chest_length",
          "waist_length",
          "hip_length",
          "pants_length",
          "foot_length",
          "size_value",
        ]),
      );
    } else {
      if (filledBodyParts.length != 0) {
        setVisibleColumns(
          new Set([
            "size_value",
            ...[
              "height",
              "head_length",
              "chest_length",
              "waist_length",
              "hip_length",
              "pants_length",
              "foot_length",
            ].filter((col) =>
              data.some((item) => item[col] !== null && item[col] !== ""),
            ),
          ]),
        );
      }
    }
  };

  const menuItems = [
    ...[
      "height",
      "head_length",
      "chest_length",
      "waist_length",
      "hip_length",
      "pants_length",
      "foot_length",
    ].map((key) => ({
      key,
      label: (
        <Checkbox
          checked={visibleColumns.has(key)}
          onChange={(e) => handleColumnVisibilityChange(key, e.target.checked)}
        >
          {key.replace("_", " ")}
        </Checkbox>
      ),
    })),
    {
      key: "show_all",
      label: (
        <Checkbox
          checked={showAll}
          onChange={(e) => handleShowAllColumns(e.target.checked)}
        >
          Show All
        </Checkbox>
      ),
    },
  ];

  const columns = [
    {
      title: "Height",
      dataIndex: "height",
      editable: true,
      width: "10%",
    },
    {
      title: "Head Length",
      dataIndex: "head_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Chest Length",
      dataIndex: "chest_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Waist Length",
      dataIndex: "waist_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Hip Length",
      dataIndex: "hip_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Pants Length",
      dataIndex: "pants_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Foot Length",
      dataIndex: "foot_length",
      editable: true,
      width: "10%",
    },
    {
      title: "Size System",
      dataIndex: "size_system",
      editable: false,
      render: (value: string) => value,
      width: "10%",
    },
    {
      title: "Size Value",
      dataIndex: "size_value",
      editable: true,
      width: "10%",
      render: (_: any, record: TableDataWithKey) => (
        <Select
          value={record.size_value}
          style={{ width: "100%" }}
          disabled={!isEditing(record)}
          onChange={(value) => {
            const newData = data.map((item) =>
              item.key === record.key ? { ...item, size_value: value } : item,
            );
            setData(newData);
          }}
        >
          <Select.Option value={null}>NULL</Select.Option>
          {possibleSizeValues.map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "1%",
      render: (_: any, record: TableDataWithKey) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
              icon={<SaveOutlined />}
            />
            <Popconfirm title="Are you sure to cancel?" onConfirm={cancel}>
              <Button icon={<CloseOutlined />} />
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => deleteRow(record.key)}
            >
              <Button disabled={editingKey !== ""} icon={<DeleteOutlined />} />
            </Popconfirm>
          </span>
        );
      },
    },
  ].filter(
    (col) => col.dataIndex === "operation" || visibleColumns.has(col.dataIndex),
  );

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: TableDataWithKey) => ({
        record,
        inputType: col.dataIndex === "size_value" ? "text" : "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        possibleSizeValues,
        selectedSizeSystem,
      }),
    };
  });

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Dropdown>
      </div>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 20,
          }}
          footer={() => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={addNewRow}
                type="dashed"
                style={{ maxWidth: "700px", width: "100%" }}
              >
                Add Row
              </Button>
            </div>
          )}
          scroll={{ x: "max-content" }}
        />
      </Form>
    </div>
  );
};

export default EditableTable;
