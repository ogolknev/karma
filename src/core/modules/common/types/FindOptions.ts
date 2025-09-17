import { FilterOption } from "./FilterOption";
import { PaginationOption } from "./PaginationOption";

export type FindOptions<T extends object> = PaginationOption & FilterOption<T>