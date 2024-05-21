import { Button, Space, Select, Divider, notification } from "antd";
import { useState, useEffect } from "react";
import { useBrandsQuery, useClothesQuery, useTableDataQuery } from "./queries";
import EditableTable from "../../../components/EditableTable";
import { RocketOutlined, SearchOutlined } from "@ant-design/icons";
import { TableData } from "../../../utils/types/TableData";
import Title from "antd/es/typography/Title";
import { postJson } from "../../../api/Api";

type TableDataWithKey = TableData & { key: string };

const SizeTables = () => {
  const [selectedGender, setSelectedGender] = useState("none");
  const [selectedBrand, setSelectedBrand] = useState("none");
  const [selectedCloth, setSelectedCloth] = useState("none");
  const [selectedSizeSystem, setSelectedSizeSystem] = useState("");
  const [isHandleSearch, setHandleSearch] = useState(false);
  const [data, setData] = useState<TableDataWithKey[]>([]);
  const [possibleSizeSystems, setPossibleSizeSystems] = useState<string[]>([]);
  const [possibleSizeValues, setPossibleSizeValues] = useState<string[]>([]);

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setSelectedBrand("none");
    setSelectedCloth("none");
    setHandleSearch(false);
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedCloth("none");
    setHandleSearch(false);
  };

  const handleClothChange = (value: string) => {
    setSelectedCloth(value);
    setHandleSearch(false);
  };

  const handleSizeSystemChange = (value: string) => {
    setSelectedSizeSystem(value);
  };

  const brandsQuery = useBrandsQuery(selectedGender);
  const clothesQuery = useClothesQuery(selectedGender, selectedBrand);
  const tableData = useTableDataQuery(
    isHandleSearch,
    selectedGender,
    selectedBrand,
    selectedCloth
  );

  useEffect(() => {
    if (tableData.data && tableData.data.conversions) {
      setData(
        tableData.data.conversions.map((item, index) => ({
          ...item,
          key: (index + 1).toString(),
        }))
      );
      setPossibleSizeSystems(tableData.data.possibleSizeSystems);
      setPossibleSizeValues(tableData.data.possibleSizeValues);
      if (tableData.data.conversions.length > 0) {
        setSelectedSizeSystem(tableData.data.conversions[0].size_system);
      }
    }
  }, [tableData.data]);

  useEffect(() => {
    data.forEach((item) => {
      item.size_system = selectedSizeSystem;
    });
  }, [data, selectedSizeSystem]);

  const handleUpdateClick = async () => {
    const isValid = data.every(
      (item) =>
        item.size_value &&
        (item.height !== null ||
          item.head_length !== null ||
          item.chest_length !== null ||
          item.waist_length !== null ||
          item.hip_length !== null ||
          item.pants_length !== null ||
          item.foot_length !== null)
    );

    if (isValid) {
      try {
        const response = await postJson("api/update-conversions", data);
        console.log(response);
        notification.success({
          message: "Успішно",
          description: "Данні успішно змінено!",
        });
      } catch (error: any) {
        console.error("Error:", error);
        notification.error({
          message: "Помилка",
          description: `Сталась помилка при завантаженні данних: ${error.message}`,
        });
      }
    } else {
      notification.error({
        message: "Помилка валідації",
        description:
          "Переконайтеся, що у кожного рядку значення розміру та принаймні одне вимірювання заповнені",
      });
    }
  };

  return (
    <>
      <div className="mt-6 flex flex-col items-center md:items-start">
        <Space direction="vertical" size="middle">
          <Select
            defaultValue="none"
            style={{ width: 200 }}
            onChange={handleGenderChange}
            options={[
              { value: "none", label: "-- Виберіть стать --" },
              { value: "male", label: "Men" },
              { value: "female", label: "Women" },
              { value: "child", label: "Children" },
            ]}
          />
          <Select
            defaultValue="none"
            disabled={brandsQuery.data.length === 0 || brandsQuery.isFetching}
            style={{ width: 200 }}
            value={selectedBrand}
            onChange={handleBrandChange}
            options={[
              { value: "none", label: "-- Виберіть бренд --" },
              ...brandsQuery.data.map((brand) => ({
                value: brand.key,
                label: brand.name,
              })),
            ]}
          />
          <Select
            defaultValue="none"
            disabled={
              selectedBrand === "none" || clothesQuery.data.length === 0
            }
            style={{ width: 200 }}
            value={selectedCloth}
            onChange={handleClothChange}
            options={[
              { value: "none", label: "-- Виберіть тип одягу --" },
              ...clothesQuery.data.map((cloth) => ({
                value: cloth.key,
                label: cloth.name,
              })),
            ]}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ width: 200 }}
            disabled={
              selectedGender === "none" ||
              selectedBrand === "none" ||
              selectedCloth === "none"
            }
            onClick={() => setHandleSearch(true)}
          >
            Пошук
          </Button>
        </Space>
        <Divider />
      </div>
      {isHandleSearch && data.length > 0 && (
        <>
          <div className="flex flex-col items-center md:items-start">
            <Title level={5}>Виберіть систему:</Title>
            <Select
              defaultValue={selectedSizeSystem}
              style={{ width: 200 }}
              onChange={handleSizeSystemChange}
              options={[
                ...possibleSizeSystems.map((system) => ({
                  value: system,
                  label: system,
                })),
              ]}
            />
          </div>
        </>
      )}
      {isHandleSearch && data.length > 0 && (
        <>
          <Divider />
          <EditableTable
            data={data}
            setData={setData}
            possibleSizeValues={possibleSizeValues}
            selectedSizeSystem={selectedSizeSystem}
            uniqClothId={tableData.data.conversions[0].uniq_cloth_id || 1}
          />
          <div className="flex justify-center mb-6">
            <Button
              type="primary"
              style={{ width: 300, height: 50 }}
              onClick={handleUpdateClick}
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

export default SizeTables;
