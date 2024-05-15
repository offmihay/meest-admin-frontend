import { Select } from "antd";
import { useEffect, useState } from "react";
import { fetchJson } from "../../hooks/Api";

interface Brand {
  id: number;
  name: string;
  key: string;
}

interface Cloth {
  id: number;
  name: string;
  key: string;
}

const SizeTables = () => {
  const [selectedGender, setSelectedGender] = useState("none");
  const [selectedBrand, setSelectedBrand] = useState("none");
  const [selectedCloth, setSelectedCloth] = useState("none");
  const [brandsByGender, setBrandsByGender] = useState<Brand[]>([]);
  const [clothByBrand, setClothByBrand] = useState<Cloth[]>([]);

  const handleGenderChange = (value: string) => {
    setBrandsByGender([]);
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

  useEffect(() => {
    selectedGender != "none" &&
      fetchJson(`api/brands?gender=${selectedGender}`)
        .then((data) => setBrandsByGender(data))
        .catch((err) => {
          console.error(err);
        });
  }, [selectedGender]);

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
        style={{ width: 150 }}
        onChange={handleGenderChange}
        options={[
          { value: "none", label: "Стать" },
          { value: "male", label: "Men" },
          { value: "female", label: "Women" },
          { value: "child", label: "Children" },
        ]}
      />
      <Select
        defaultValue="none"
        disabled={brandsByGender.length == 0}
        style={{ width: 150 }}
        value={selectedBrand}
        onChange={handleBrandChange}
        options={[
          { value: "none", label: "Бренд" },
          ...brandsByGender.map((brand) => ({
            value: brand.key,
            label: brand.name,
          })),
        ]}
      />
      <Select
        defaultValue="none"
        disabled={brandsByGender.length == 0 || clothByBrand.length == 0}
        style={{ width: 150 }}
        value={selectedCloth}
        onChange={handleClothChange}
        options={[
          { value: "none", label: "Одяг" },
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
