import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../../../api/Api";
import { Brand } from "../../../utils/types/Brand";
import { Cloth } from "../../../utils/types/Cloth";

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
