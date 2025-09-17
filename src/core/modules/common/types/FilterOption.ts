export interface FilterOption<T extends object> {
  filters: FilterDTO<T>[];
}

interface FilterDTO<T extends object> {
  key: keyof T;
  value: string;
}
