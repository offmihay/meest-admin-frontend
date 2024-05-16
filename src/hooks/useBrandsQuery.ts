import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../api/Api";
import { Brand } from "../utils/types/Brand";

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
