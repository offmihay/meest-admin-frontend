import React, { useEffect, useState } from "react";
import EditableConversionTable from "../../../components/EditableConversionTable";
import {
  useConversionsTableQuery,
  useSysCategoriesQuery,
  useUpdateSysCategoriesMutation,
} from "../../../hooks/queries";
import { Button, Select, Spin, notification } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { ConversionMapping, FilteredConversionMapping } from "../../../utils/types/ConversionForm";

const SizeConversions: React.FC = () => {
  const [data, setData] = useState<ConversionMapping[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<string[]>([]);
  const [selectedSystemCategory, setSelectedSystemCategory] = useState("none");
  const sysCategoriesQuery = useSysCategoriesQuery();

  const updateSysCategoriesMutation = useUpdateSysCategoriesMutation();

  const handleSystemCategoryChange = (value: string) => {
    setSelectedSystemCategory(value);
  };

  const conversionsTableQuery = useConversionsTableQuery(selectedSystemCategory);

  useEffect(() => {
    if (conversionsTableQuery.data.length !== 0) {
      setData(conversionsTableQuery.data.sizes);
      setDynamicColumns(conversionsTableQuery.data.awailable_systems);
    } else {
      setData([]);
    }
  }, [conversionsTableQuery.data]);

  const checkKeysConsistency = () => {
    if (data.length === 0) return true;

    const referenceKeys = Object.keys(data[0]).filter(
      (key) => data[0][key] !== null && data[0][key] !== ""
    );
    for (let i = 1; i < data.length; i++) {
      const currentKeys = Object.keys(data[i]).filter(
        (key) => data[i][key] !== null && data[i][key] !== ""
      );
      if (currentKeys.length !== referenceKeys.length) {
        return false;
      }
      for (let key of referenceKeys) {
        if (!currentKeys.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const filterData = (): FilteredConversionMapping[] => {
    return data.map((obj: ConversionMapping) => {
      const filteredObj: FilteredConversionMapping = {};
      for (let key of dynamicColumns) {
        if (obj[key] && obj[key] !== "") {
          filteredObj[key] = obj[key];
        }
      }
      return filteredObj;
    });
  };

  const handleUpdateClick = async () => {
    try {
      if (checkKeysConsistency()) {
        const req = { system_category: selectedSystemCategory, newSizes: filterData() };
        updateSysCategoriesMutation.mutate(req, {
          onSuccess: () => {
            notification.success({
              message: "Успішно",
              description: "Розмірну сітку успішно змінено!",
            });
          },
          onError: (error) => {
            notification.error({
              message: "Помилка",
              description: `Сталась помилка при зміненні розмірної сітки: ${error.message}`,
            });
          },
        });
      } else {
        notification.error({
          message: "Помилка",
          description: `Неправильно заповнені дані. Кожна колонка має бути повністю заповнена або пуста`,
        });
      }
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  return (
    <>
      <Select
        defaultValue="none"
        style={{ width: 200 }}
        value={selectedSystemCategory}
        onChange={handleSystemCategoryChange}
        options={[
          { value: "none", label: "-- Виберіть тип розмірної сітки --" },
          ...sysCategoriesQuery.data.map((category) => ({
            value: category.key,
            label: category.name,
          })),
        ]}
        className="mb-4"
      />
      {selectedSystemCategory !== "none" && (
        <>
          <Spin spinning={conversionsTableQuery.isFetching}>
            <EditableConversionTable data={data} setData={setData} columns={dynamicColumns} />
          </Spin>
          <div className="flex justify-center mb-6 mt-2">
            <Button
              type="primary"
              style={{ width: 300, height: 50 }}
              onClick={handleUpdateClick}
              disabled={conversionsTableQuery.isFetching}
            >
              <div className="flex items-center justify-center gap-2">
                <RocketOutlined style={{ fontSize: 25 }} />
                <span style={{ fontSize: 16 }}>Оновити інформацію</span>
              </div>
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SizeConversions;
