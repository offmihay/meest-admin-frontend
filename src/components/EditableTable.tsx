import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Button,
  notification,
  Tooltip,
  Dropdown,
  Checkbox,
} from "antd";
import {
  QuestionCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { TableData } from "../utils/types/TableData";

interface TableDataWithKey extends TableData {
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  const rules: any[] = [
    {
      required: dataIndex === "size_value",
      message: "",
    },
    {
      validator: (_: any, value: any) => {
        if (dataIndex === "size_value") {
          if (
            possibleSizeValues.includes(value) ||
            (Number(value) >= 0 && Number(value) <= 1000)
          ) {
            return Promise.resolve();
          }
          return Promise.reject();
        }
        return Promise.resolve();
      },
    },
  ];

  if (dataIndex !== "size_value") {
    rules.push({
      validator: (_: any, value: any) => {
        if (value >= 0 && value <= 1000) {
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
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(
      [
        "height",
        "head_length",
        "chest_length",
        "waist_length",
        "hip_length",
        "pants_length",
        "foot_length",
        "size_value",
        "operation",
      ].filter((col) =>
        data.some((item) => item[col] !== null && item[col] !== "")
      )
    )
  );

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
    description?: string
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

      const valid = Object.keys(row).some(
        (field) =>
          field !== "size_value" &&
          field !== "key" &&
          field !== "isNew" &&
          row[field] !== null
      );

      if (!valid) {
        throw new Error(
          "Хоча б один параметр має бути заповнений, окрім Size Value"
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
      const errorMessage =
        "Хоча б один параметр має бути заповнений, окрім Size Value. Для Size Value допустимі значення: [XXS, XS, S, M, L, XL, XXL, XXXL] або числове значення";
      openNotification("error", "Не правильно введені дані", errorMessage);
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
      size_value: "",
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
    if (key === "size_value" || key === "operation") return; // Нельзя скрывать колонки size_value и operation
    const newVisibleColumns = new Set(visibleColumns);
    if (checked) {
      newVisibleColumns.add(key);
    } else {
      newVisibleColumns.delete(key);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const menuItems = [
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
  }));

  const columns = [
    {
      title: "Height",
      dataIndex: "height",
      width: "10%",
      editable: true,
    },
    {
      title: "Head Length",
      dataIndex: "head_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Chest Length",
      dataIndex: "chest_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Waist Length",
      dataIndex: "waist_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Hip Length",
      dataIndex: "hip_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Pants Length",
      dataIndex: "pants_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Foot Length",
      dataIndex: "foot_length",
      width: "10%",
      editable: true,
    },
    {
      title: "Size Value",
      dataIndex: "size_value",
      width: "10%",
      editable: true,
    },
    {
      title: (
        <span>
          Operation{" "}
          <Tooltip title="Хоча б один параметр має бути заповнений, окрім Size Value. Для Size Value допустимі значення: [XXS, XS, S, M, L, XL, XXL, XXXL] або числове значення">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: "operation",
      width: "1%",
      render: (_: any, record: TableDataWithKey) => {
        const editable = isEditing(record);
        return editable ? (
          <span style={{ display: "flex", gap: "8px" }}>
            <Button
              icon={<SaveOutlined />}
              type="link"
              onClick={() => save(record.key)}
            >
              Зберегти
            </Button>
            <Button
              icon={<CloseOutlined />}
              type="link"
              onClick={cancel}
              danger
            >
              Скасувати
            </Button>
          </span>
        ) : (
          <span style={{ display: "flex", gap: "8px" }}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            >
              Редагувати
            </Button>
            <Popconfirm
              title="Ви впевнені що хочете видалити цей рядок?"
              onConfirm={() => deleteRow(record.key)}
              okText="Так"
              cancelText="Ні"
            >
              <Button type="link" icon={<DeleteOutlined />} danger>
                Видалити
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns
    .filter((col) => visibleColumns.has(col.dataIndex))
    .map((col) => {
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
          possibleSizeValues: possibleSizeValues,
          selectedSizeSystem: selectedSizeSystem,
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
                Додати рядок
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
