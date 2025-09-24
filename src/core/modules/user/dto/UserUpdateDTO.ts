import { BaseUserDTO } from "./BaseUserDTO";

export type UserUpdateDTO = Partial<Omit<BaseUserDTO, "id" | "username">>;
