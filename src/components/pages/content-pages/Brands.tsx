import React, { useState } from "react";
import { fetchJson } from "../../../hooks/Api";
import { Button } from "antd";

const Brands: React.FC = () => {
  const [dataObj, setDataObj] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const data = await fetchJson("api/all-users");
      setDataObj(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button onClick={fetchData}>Show users</Button>
      {dataObj && (
        <div className="flex gap-4 flex-wrap m-8">
          {dataObj.map((item, index) => (
            <div key={index} className="w-[500px] bg-[#eeeeee] rounded-2xl p-8">
              {Object.keys(item).map((key) => (
                <p key={key} className="text-[20px] p-1 font-medium">
                  <span>{key}: </span>
                  <span className="text-[#FF0000]">{item[key]}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Brands;
