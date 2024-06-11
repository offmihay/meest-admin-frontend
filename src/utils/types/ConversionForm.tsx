export type ConversionMapping = {
  key: string;
  [key: string]: string | null;
};

export type FilteredConversionMapping = {
  [key: string]: string | null;
};

export type ConversionForm = {
  system_category: string;
  newSizes: FilteredConversionMapping[];
};
