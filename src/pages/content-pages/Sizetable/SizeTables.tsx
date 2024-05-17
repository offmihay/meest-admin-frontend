import { Flex, Select } from "antd";
import { useState } from "react";
import { useBrandsQuery, useClothesQuery } from "./queries";
import EditableTable, { Item } from "../../../components/EditableTable";

const SizeTables = () => {
  const [selectedGender, setSelectedGender] = useState("none");
  const [selectedBrand, setSelectedBrand] = useState("none");
  const [selectedCloth, setSelectedCloth] = useState("none");

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    setSelectedBrand("none");
    setSelectedCloth("none");
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedCloth("none");
  };

  const handleClothChange = (value: string) => {
    setSelectedCloth(value);
  };

  const brandsQuery = useBrandsQuery(selectedGender);
  const clothesQuery = useClothesQuery(selectedGender, selectedBrand);

  const originData: Item[] = [];
  for (let i = 0; i < 100; i++) {
    originData.push({
      key: i.toString(),
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  const [data, setData] = useState(originData);

  return (
    <>
      <Flex gap="middle" vertical>
        <Select
          defaultValue="none"
          style={{ width: 200 }}
          onChange={handleGenderChange}
          options={[
            { value: "none", label: "-- Select Gender --" },
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
            { value: "none", label: "-- Select Brand --" },
            ...brandsQuery.data.map((brand) => ({
              value: brand.key,
              label: brand.name,
            })),
          ]}
        />
        <Select
          defaultValue="none"
          disabled={
            brandsQuery.data.length === 0 || clothesQuery.data.length === 0
          }
          style={{ width: 200 }}
          value={selectedCloth}
          onChange={handleClothChange}
          options={[
            { value: "none", label: "-- Select Cloth Type --" },
            ...clothesQuery.data.map((cloth) => ({
              value: cloth.key,
              label: cloth.name,
            })),
          ]}
        />
      </Flex>
      {/* <EditableTable data={data} setData={setData} /> */}
    </>
  );
};

export default SizeTables;
