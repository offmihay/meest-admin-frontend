import React, { useState, useEffect } from "react";
import {
  FloatButton,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Spin,
  Switch,
  notification,
} from "antd";
import { Brand } from "../../../utils/types/Brand";
import {
  useAllBrandsQuery,
  useAllClothesQuery,
  useDeleteBrandMutation,
  useUpdateBrandsMutation,
} from "../../../hooks/queries";
import LogoCard from "../../../components/LogoCard";
import _ from "lodash";
import { FileAddOutlined } from "@ant-design/icons";
import useIsMobile from "../../../hooks/useIsMobile";

const Brands = () => {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedDeleteBrand, setSelectedDeleteBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();
  const isMobile = useIsMobile();

  const allBrandsQuery = useAllBrandsQuery();

  const allClothesQuery = useAllClothesQuery(
    selectedBrand?.key,
    selectedBrand?.is_new ?? false,
    !!selectedBrand
  );

  const updateBrandsMutation = useUpdateBrandsMutation();
  const deleteBrandMutation = useDeleteBrandMutation();

  useEffect(() => {
    if (open && allClothesQuery.data && selectedBrand) {
      const { men, women, child } = allClothesQuery.data[0]?.exist_clothes || {};

      form.setFieldsValue({
        id: selectedBrand.id,
        key: selectedBrand.key,
        name: selectedBrand.name,
        men_clothes: men || [],
        women_clothes: women || [],
        child_clothes: child || [],
        img_url: selectedBrand.img_url,
        is_active: selectedBrand.is_active,
      });
    }
  }, [open, allClothesQuery.data, selectedBrand, form]);

  useEffect(() => {
    if (selectedDeleteBrand) {
      deleteBrandMutation.mutate(selectedDeleteBrand, {
        onSuccess: () => {
          notification.success({
            message: "Успішно",
            description: "Бренд успішно видалено!",
          });
          setSelectedDeleteBrand(null);
          allBrandsQuery.refetch();
        },
        onError: (error) => {
          notification.error({
            message: "Помилка",
            description: `Сталась помилка при видаленні бренду: ${error.message}`,
          });
          setSelectedDeleteBrand(null);
        },
      });
    }
  }, [selectedDeleteBrand]);

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpen(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedDeleteBrand(brand);
  };

  const emptyBrand = {
    id: null,
    img_url: "",
    is_active: false,
    key: "",
    name: "",
    is_new: true,
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
      updateBrandsMutation.mutate(values, {
        onSuccess: () => {
          notification.success({
            message: "Успішно",
            description: "Данні успішно змінено!",
          });
          setOpen(false);
          setSelectedBrand(null);
          allBrandsQuery.refetch();
        },
        onError: (error) => {
          notification.error({
            message: "Помилка",
            description: `Сталась помилка при завантаженні данних: ${error.message}`,
          });
        },
      });
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  console.log("selectedBrand:", selectedBrand); // Добавим лог для отладки

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        {allBrandsQuery.data?.map((item) => (
          <LogoCard
            key={item.id}
            logoSrc={item.img_url}
            companyName={item.key}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>

      <Modal
        title={selectedBrand?.is_new ? "Додати новий бренд" : "Редагувати інформацію про бренд"}
        centered
        wrapClassName="!top-2"
        open={open}
        onOk={handleFormSubmit}
        onCancel={() => {
          setOpen(false);
          setSelectedBrand(null); // reset selected brand
        }}
        width={1000}
      >
        <Spin
          spinning={
            allClothesQuery.isFetching ||
            allBrandsQuery.isFetching ||
            updateBrandsMutation.isPending
          }
        >
          <Skeleton
            style={{ padding: 20 }}
            active
            paragraph={{ rows: 10 }}
            round
            loading={allClothesQuery.isFetching}
          />
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{
              maxWidth: 600,
              marginTop: 40,
              display: allClothesQuery.isFetching ? "none" : "block", //for skeleton
            }}
            initialValues={{
              key: selectedBrand?.key || "",
              name: selectedBrand?.name || "",
              men_clothes: allClothesQuery.data?.[0]?.exist_clothes?.men || [],
              women_clothes: allClothesQuery.data?.[0]?.exist_clothes?.women || [],
              child_clothes: allClothesQuery.data?.[0]?.exist_clothes?.child || [],
              img_url: selectedBrand?.img_url || "",
              is_active: selectedBrand?.is_active || false,
            }}
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
            <Form.Item label="Активний" name="is_active">
              <Switch />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <FloatButton
        icon={<FileAddOutlined style={{ fontSize: 25 }} />}
        shape="circle"
        style={{ right: isMobile ? 30 : 100, bottom: isMobile ? 30 : 100, width: 60, height: 60 }}
        className="flex justify-center items-center"
        onClick={() => handleEdit(emptyBrand)}
      />
    </>
  );
};

export default Brands;
