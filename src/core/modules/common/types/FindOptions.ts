import { FilterOption } from "./FilterOption";
import { PaginationOption } from "./PaginationOption";

export type FindOptions<T extends object> = Partial<PaginationOption & FilterOption<T>>