import React, { useState, useEffect } from "react";
import EditableTable from "../../../components/EditableSizeTable";
import { Select, Button, Divider, notification, Spin } from "antd";
import { useBrandsQuery, useClothesQuery, useTableDataQuery } from "../../../hooks/queries";
import { SizeTableData } from "../../../utils/types/SizeTableData";
import { RocketOutlined } from "@ant-design/icons";
import { postJson } from "../../../api/Api";

type TableDataWithKey = SizeTableData & { key: string };

const SizeTables: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState("none");
  const [selectedBrand, setSelectedBrand] = useState("none");
  const [selectedCloth, setSelectedCloth] = useState("none");
  const [selectedSizeSystem, setSelectedSizeSystem] = useState("none");
  const [isHandleSearch, setHandleSearch] = useState(false);
  const [data, setData] = useState<TableDataWithKey[]>([]);
  const [possibleSizeSystems, setPossibleSizeSystems] = useState<string[]>([]);
  const [possibleSizeValues, setPossibleSizeValues] = useState<string[]>([]);
  const [uniqClothId, setUniqClothId] = useState(1);

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setSelectedBrand("none");
    setSelectedCloth("none");
    setSelectedSizeSystem("none");
    setHandleSearch(false);
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedCloth("none");
    setSelectedSizeSystem("none");
    setHandleSearch(false);
  };

  const handleClothChange = (value: string) => {
    setSelectedCloth(value);
    if (value != "none") {
      setHandleSearch(true);
    } else {
      setHandleSearch(false);
    }
  };

  const handleSizeSystemChange = (value: string) => {
    setSelectedSizeSystem(value);
  };

  const brandsQuery = useBrandsQuery(selectedGender);
  const clothesQuery = useClothesQuery(selectedGender, selectedBrand);
  const tableData = useTableDataQuery(isHandleSearch, selectedGender, selectedBrand, selectedCloth);

  useEffect(() => {
    if (tableData.data && tableData.data.conversions) {
      setData(
        !tableData.data.isEmpty
          ? tableData.data.conversions.map((item, index) => ({
              ...item,
              key: (index + 1).toString(),
            }))
          : []
      );

      if (tableData.data.conversions.length > 0) {
        setSelectedSizeSystem(tableData.data.conversions[0].size_system);
        setUniqClothId(tableData.data.conversions[0].uniq_cloth_id);
        setPossibleSizeSystems(tableData.data.possibleSizeSystems);
        setPossibleSizeValues(
          tableData.data.possibleSizeValues[tableData.data.conversions[0].size_system]
        );
      }
    }
  }, [tableData.data.conversions]);

  useEffect(() => {
    setPossibleSizeValues(tableData.data?.possibleSizeValues[selectedSizeSystem] || []);
  }, [selectedSizeSystem, tableData.data]);

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
        let tempdata;
        if (data.length != 0) {
          tempdata = data.map((obj) => ({
            ...obj,
            size_system: selectedSizeSystem,
          }));
        } else {
          tempdata = [
            { uniq_cloth_id: uniqClothId, size_system: selectedSizeSystem, isEmpty: true },
          ];
        }

        const response = await postJson("api/update-conversions", tempdata);
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
      <div className="mt-6 flex flex-col lg:flex-row gap-4 items-center md:items-start">
        <Select
          defaultValue="none"
          style={{ width: 200 }}
          value={selectedGender}
          onChange={handleGenderChange}
          options={[
            { value: "none", label: "-- Виберіть стать --" },
            { value: "male", label: "Чоловік" },
            { value: "female", label: "Жінка" },
            { value: "child", label: "Дитина" },
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
          disabled={selectedBrand === "none" || clothesQuery.data.length === 0}
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

        {/* <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ width: 200 }}
          disabled={
            selectedGender === "none" || selectedBrand === "none" || selectedCloth === "none"
          }
          onClick={() => setHandleSearch(true)}
        >
          Пошук
        </Button> */}
      </div>
      {
        <>
          <Divider />
          <div className="flex flex-col items-center md:items-start">
            <Select
              disabled={!isHandleSearch && data.length == 0}
              defaultValue="none"
              value={selectedSizeSystem}
              style={{ width: 200 }}
              onChange={handleSizeSystemChange}
              options={[
                { value: "none", label: "-- Виберіть систему --" },
                ...possibleSizeSystems.map((system) => ({
                  value: system,
                  label: system,
                })),
              ]}
            />
          </div>
        </>
      }
      {isHandleSearch && (
        <>
          <Divider />
          <Spin spinning={tableData.isFetching}>
            <EditableTable
              data={data}
              setData={setData}
              possibleSizeValues={possibleSizeValues}
              selectedSizeSystem={selectedSizeSystem}
              setSelectedSizeSystem={setSelectedSizeSystem}
              uniqClothId={uniqClothId}
            />
          </Spin>
          <div className="flex justify-center mb-6 mt-2">
            <Button
              type="primary"
              style={{ width: 300, height: 50 }}
              onClick={handleUpdateClick}
              disabled={tableData.isFetching}
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
