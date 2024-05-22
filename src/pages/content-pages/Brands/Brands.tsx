import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Select, Spin, notification } from "antd";
import { Brand } from "../../../utils/types/Brand";
import { useAllBrandsQuery, useAllClothesQuery } from "../../../hooks/queries";
import LogoCard from "../../../components/LogoCard";
import _ from "lodash";
import { postJson } from "../../../api/Api";

const Brands: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const allBrandsQuery = useAllBrandsQuery();
  const allClothesQuery = useAllClothesQuery(selectedBrand?.key);

  useEffect(() => {
    if (
      open &&
      allClothesQuery.data &&
      allClothesQuery.data.length > 0 &&
      selectedBrand
    ) {
      const { men, women, child } = allClothesQuery.data[0].exist_clothes;

      form.setFieldsValue({
        id: selectedBrand.id,
        key: selectedBrand.key,
        name: selectedBrand.name,
        men_clothes: men,
        women_clothes: women,
        child_clothes: child,
        img_url: selectedBrand.img_url,
      });
    }
  }, [open, allClothesQuery.data, selectedBrand, form]);

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setFieldsValue({
      key: _.snakeCase(name),
    });
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await postJson("api/update-brands", values);
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
    allBrandsQuery.refetch();
    allClothesQuery.refetch();
    setOpen(false);
    setSelectedBrand(null);
  };

  if (allBrandsQuery.isLoading || (open && allClothesQuery.isLoading)) {
    return <Spin />;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        {allBrandsQuery.data?.map((item: Brand) => (
          <LogoCard
            key={item.id}
            logoSrc={item.img_url}
            companyName={item.key}
            onEdit={() => handleEdit(item)}
            onDelete={() => {}}
          />
        ))}
      </div>
      <Modal
        title="Редагувати інформацію про бренд"
        centered
        open={open}
        onOk={handleFormSubmit}
        onCancel={() => {
          setOpen(false);
          setSelectedBrand(null); // reset selected brand
        }}
        width={1000}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600, marginTop: 40 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Назва бренду"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the brand name",
              },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: "Brand name must be in English",
              },
            ]}
          >
            <Input onChange={handleNameChange} />
          </Form.Item>
          <Form.Item
            label="Транскрипція бренду"
            name="key"
            rules={[
              {
                required: true,
                message: "Please enter the transcription of the brand",
              },
              {
                pattern: /^[a-z]+(_[a-z]+)*$/,
                message: "Transcription must be in English in snake_case",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="Чоловічий одяг" name="men_clothes">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].all_clothes.map((item: string) => ({
                      label: item,
                      value: item,
                    }))
                  : []
              }
              defaultValue={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].exist_clothes.men
                  : []
              }
            />
          </Form.Item>
          <Form.Item label="Жіночий одяг" name="women_clothes">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].all_clothes.map((item: string) => ({
                      label: item,
                      value: item,
                    }))
                  : []
              }
              defaultValue={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].exist_clothes.women
                  : []
              }
            />
          </Form.Item>
          <Form.Item label="Дитячий одяг" name="child_clothes">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              options={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].all_clothes.map((item: string) => ({
                      label: item,
                      value: item,
                    }))
                  : []
              }
              defaultValue={
                allClothesQuery.data && allClothesQuery.data.length > 0
                  ? allClothesQuery.data[0].exist_clothes.child
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            label="Лінк на лого бренду:"
            name="img_url"
            rules={[
              {
                required: true,
                message: "Please enter the link",
              },
              {
                type: "url",
                message: "Please enter a valid URL",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Brands;
