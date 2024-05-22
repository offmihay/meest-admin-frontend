import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../api/Api";
import { Brand } from "../utils/types/Brand";
import { Cloth } from "../utils/types/Cloth";
import { TableData } from "../utils/types/TableData";

export const useBrandsQuery = (selectedGender: string) => {
  return useQuery({
    queryKey: ["brands", selectedGender],
    queryFn: (): Promise<Brand[]> =>
      fetchJson(`api/brands?gender=${selectedGender}`),
    initialData: [],
    enabled: selectedGender != "none",
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useClothesQuery = (
  selectedGender: string,
  selectedBrand: string
) => {
  return useQuery({
    queryKey: ["clothes", selectedBrand],
    queryFn: (): Promise<Cloth[]> =>
      fetchJson(`api/clothes?gender=${selectedGender}&brand=${selectedBrand}`),
    initialData: [],
    enabled: selectedGender != "none" && selectedBrand != "none",
    refetchOnWindowFocus: false,
    retry: 0,
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
      conversions: TableData[];
      possibleSizeSystems: string[];
      possibleSizeValues: string[];
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
    retry: 0,
  });
};

export const useAllBrandsQuery = () => {
  return useQuery({
    queryKey: ["all-brands"],
    queryFn: (): Promise<Brand[]> => fetchJson(`api/all-brands`),
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useAllClothesQuery = (brandKey: string | undefined) => {
  return useQuery({
    queryKey: ["exist-clothes", brandKey],
    queryFn: () => fetchJson(`api/clothes-existing?brand=${brandKey}`),
    initialData: {
      all_clothes: [],
      exist_clothes: {
        men: [],
        women: [],
        child: [],
      },
    },
    enabled: !!brandKey,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};