import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchJson, postJson } from "../api/Api";
import { Brand } from "../utils/types/Brand";
import { Cloth } from "../utils/types/Cloth";
import { SizeTableData } from "../utils/types/SizeTableData";
import { BrandForm } from "../utils/types/BrandForm";
import { ConversionForm } from "../utils/types/ConversionForm";

export const useBrandsQuery = (selectedGender: string) => {
  return useQuery({
    queryKey: ["brands", selectedGender],
    queryFn: (): Promise<Brand[]> => fetchJson(`api/brands?gender=${selectedGender}`),
    initialData: [],
    enabled: selectedGender != "none",
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useClothesQuery = (selectedGender: string, selectedBrand: string) => {
  return useQuery({
    queryKey: ["clothes", selectedBrand],
    queryFn: (): Promise<Cloth[]> =>
      fetchJson(`api/clothes?gender=${selectedGender}&brand=${selectedBrand}`),
    initialData: [],
    enabled: selectedGender != "none" && selectedBrand != "none",
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useTableDataQuery = (
  isHandleSearch: boolean,
  selectedGender: string,
  selectedBrand: string,
  selectedCloth: string
) => {
  return useQuery({
    queryKey: ["tableData", selectedGender, selectedBrand, selectedCloth],
    queryFn: (): Promise<{
      conversions: SizeTableData[];
      possibleSizeSystems: string[];
      possibleSizeValues: any;
      isEmpty: boolean;
    }> =>
      fetchJson(
        `api/get-table?gender=${selectedGender}&brand=${selectedBrand}&cloth=${selectedCloth}`
      ),
    enabled:
      isHandleSearch &&
      selectedGender !== "none" &&
      selectedBrand !== "none" &&
      selectedCloth !== "none",
    initialData: {
      conversions: [],
      possibleSizeSystems: [],
      possibleSizeValues: [],
      isEmpty: true,
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useAllBrandsQuery = () => {
  return useQuery({
    queryKey: ["all-brands"],
    queryFn: (): Promise<Brand[]> => fetchJson(`api/all-brands`),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useAllClothesQuery = (
  brandKey: string | undefined,
  isNew: boolean,
  hasBrand: boolean
) => {
  return useQuery({
    queryKey: ["exist-clothes", brandKey, isNew],
    queryFn: () => fetchJson(`api/clothes-existing?brand=${brandKey}&is_new=${isNew}`),
    initialData: {
      all_clothes: [],
      exist_clothes: {
        men: [],
        women: [],
        child: [],
      },
    },
    enabled: hasBrand, // Запрос выполняется, только если есть выбранный бренд
    refetchOnWindowFocus: false,
  });
};
export const useUpdateBrandsMutation = () => {
  return useMutation({
    mutationKey: ["update-brands"],
    mutationFn: (values: BrandForm) => postJson("api/update-brands", values),
    retry: 3,
  });
};

export const useDeleteBrandMutation = () => {
  return useMutation({
    mutationKey: ["delete-brand"],
    mutationFn: (brand: Brand) => fetchJson(`api/delete-brand?id=${brand.id}`),
    retry: 3,
  });
};

export const useConversionsTableQuery = (system_category: string) => {
  return useQuery({
    queryKey: ["conversion-table", system_category],
    queryFn: () => fetchJson(`api/system-conversions?system_category=${system_category}`),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: system_category != "none",
  });
};

export const useSysCategoriesQuery = () => {
  return useQuery({
    queryKey: ["system-categories"],
    queryFn: (): Promise<Brand[]> => fetchJson(`api/system-categories`),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useUpdateSysCategoriesMutation = () => {
  return useMutation({
    mutationKey: ["delete-system-categories"],
    mutationFn: (values: ConversionForm) => postJson("api/update-system-conversions", values),
    retry: 3,
  });
};
