import React, { useState } from "react";
import { Upload, Button, message, Popconfirm } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";

interface DataItem {
  [key: string]: string;
}

interface FileUploadProps {
  onDataParsed: (data: DataItem[]) => void;
  requiredColumns: string[];
  existingData: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onDataParsed,
  requiredColumns,
  existingData,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileReady, setFileReady] = useState(false);

  const handleUpload = () => {
    const file = fileList[0];
    if (!file) {
      message.error("Please select a file first");
      return;
    }

    const originFile = file.originFileObj as File | undefined;
    if (originFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          Papa.parse<DataItem>(e.target.result, {
            header: true,
            complete: (result) => {
              const parsedData = result.data;
              const missingColumns = requiredColumns.filter(
                (column) => !parsedData[0].hasOwnProperty(column),
              );
              if (missingColumns.length > 0) {
                message.error(
                  `Missing required columns: ${missingColumns.join(", ")}`,
                );
              } else {
                onDataParsed(parsedData);
                message.success("File processed successfully");
              }
            },
            error: (error: Error) => {
              console.error("Error parsing CSV:", error);
              message.error("Failed to process file");
            },
          });
        }
      };
      reader.readAsText(originFile);
    } else {
      message.error("Failed to read file");
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      setFileList((prevFileList) => {
        const index = prevFileList.indexOf(file);
        const newFileList = prevFileList.slice();
        newFileList.splice(index, 1);
        setFileReady(false);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      const uploadFile: UploadFile = {
        ...file,
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file,
      };
      setFileList([uploadFile]);
      setFileReady(true);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      {fileReady &&
        (existingData ? (
          <Popconfirm
            title="Are you sure you want to overwrite existing data?"
            onConfirm={handleUpload}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" style={{ marginTop: 16 }}>
              Upload
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginTop: 16 }}
          >
            Upload
          </Button>
        ))}
    </div>
  );
};

export default FileUpload;
