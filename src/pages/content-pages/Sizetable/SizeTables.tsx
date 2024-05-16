import { Select } from "antd";
import { useEffect, useState } from "react";
import { fetchJson } from "../../../api/Api";
import { useBrandsQuery } from "../../../hooks/useBrandsQuery";
import { Cloth } from "../../../utils/types/Cloth";

const SizeTables = () => {
  const [selectedGender, setSelectedGender] = useState("none");
  const [selectedBrand, setSelectedBrand] = useState("none");
  const [selectedCloth, setSelectedCloth] = useState("none");
  const [clothByBrand, setClothByBrand] = useState<Cloth[]>([]);

  const handleGenderChange = (value: string) => {
    setClothByBrand([]);
    setSelectedGender(value);
    setSelectedBrand("none");
    setSelectedCloth("none");
  };

  const handleBrandChange = (value: string) => {
    setClothByBrand([]);
    setSelectedBrand(value);
    setSelectedCloth("none");
  };

  const handleClothChange = (value: string) => {
    setSelectedCloth(value);
  };

  const brandsQuery = useBrandsQuery(selectedGender);
  const brandsByGender = brandsQuery.data;

  useEffect(() => {
    selectedBrand != "none" &&
      fetchJson(`api/clothes?gender=${selectedGender}&brand=${selectedBrand}`)
        .then((data) => setClothByBrand(data))
        .catch((err) => {
          console.error(err);
        });
  }, [selectedGender, selectedBrand]);

  return (
    <>
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
        disabled={brandsByGender.length == 0 || brandsQuery.isFetching}
        style={{ width: 200 }}
        value={selectedBrand}
        onChange={handleBrandChange}
        options={[
          { value: "none", label: "-- Виберіть бренд --" },
          ...brandsByGender.map((brand) => ({
            value: brand.key,
            label: brand.name,
          })),
        ]}
      />
      <Select
        defaultValue="none"
        disabled={brandsByGender.length == 0 || clothByBrand.length == 0}
        style={{ width: 200 }}
        value={selectedCloth}
        onChange={handleClothChange}
        options={[
          { value: "none", label: "-- Виберіть тип одягу --" },
          ...clothByBrand.map((brand) => ({
            value: brand.key,
            label: brand.name,
          })),
        ]}
      />
    </>
  );
};

export default SizeTables;
