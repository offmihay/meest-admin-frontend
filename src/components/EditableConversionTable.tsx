import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Button, notification } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

interface TableDataWithKey {
  key: string;
  [key: string]: string | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: TableDataWithKey;
}

interface EditableConversionTableProps {
  data: TableDataWithKey[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  columns: string[];
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableConversionTable: React.FC<EditableConversionTableProps> = ({
  data,
  setData,
  columns,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [newRecordKeys, setNewRecordKeys] = useState<Set<string>>(new Set());

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns));

  useEffect(() => {
    setVisibleColumns(new Set(columns));
  }, [data, columns]);

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

      const allFilled = columns.some(
        (field) => row[field] !== null && row[field] !== undefined && row[field] !== ""
      );

      if (!allFilled) {
        throw new Error("At least one column must be filled");
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
      openNotification("error", "Invalid data", "All columns must be filled.");
    }
  };

  const addNewRow = () => {
    const key = `new_${new Date().getTime()}`;
    const newRow: TableDataWithKey = { key };
    columns.forEach((col) => (newRow[col] = null));
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

  const tableColumns = columns.map((col) => ({
    title: col,
    dataIndex: col,
    editable: true,
    width: "90px",
  }));

  const operationColumn = {
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
          <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteRow(record.key)}>
            <Button disabled={editingKey !== ""} icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      );
    },
  };

  const columnsWithVisibility = tableColumns.filter(
    (col) => col.dataIndex === "operation" || visibleColumns.has(col.dataIndex)
  );

  const mergedColumns = columnsWithVisibility.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: TableDataWithKey) => ({
        record,
        inputType: typeof record[col.dataIndex] === "number" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={[...mergedColumns, operationColumn]}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 50,
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

export default EditableConversionTable;
