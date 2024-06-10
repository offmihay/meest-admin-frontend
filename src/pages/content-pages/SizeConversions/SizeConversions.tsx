import { useEffect, useState } from "react";
import EditableConversionTable from "../../../components/EditableConversionTable";
import { TableDataWithKey } from "../../../utils/types/ConversionsTableData";
import { useConversionsTableQuery, useSysCategoriesQuery } from "../../../hooks/queries";
import { Select, Spin } from "antd";

const SizeConversions: React.FC = () => {
  const [data, setData] = useState<TableDataWithKey[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [selectedSystemCategory, setSelectedSystemCategory] = useState("none");
  const sysCategoriesQuery = useSysCategoriesQuery();

  const handleSystemCategoryChange = (value: string) => {
    setSelectedSystemCategory(value);
  };

  const conversionsTableQuery = useConversionsTableQuery(selectedSystemCategory);

  useEffect(() => {
    if (conversionsTableQuery.data.length != 0) {
      setData(conversionsTableQuery.data.sizes);
      setDynamicColumns(conversionsTableQuery.data.awailable_systems);
    } else {
      setData([]);
    }
  }, [conversionsTableQuery.data]);

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
      {selectedSystemCategory != "none" && (
        <Spin spinning={conversionsTableQuery.isFetching}>
          <EditableConversionTable data={data} setData={setData} columns={dynamicColumns} />
        </Spin>
      )}
    </>
  );
};

export default SizeConversions;
