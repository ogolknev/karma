import { ServiceResponse } from "../../shared/model";
import { UserCreate, UserDTO, UserUpdate } from "./model";

export interface UserService {
  create(params: { data: UserCreate }): ServiceResponse<UserDTO>;
  get(params: { id: string }): ServiceResponse<UserDTO | null>;
  get(params: { ids?: string[], pagination?: any, sorting?: any, search?: any }): ServiceResponse<UserDTO[]>;
  update(params: { id: string, data: UserUpdate }): ServiceResponse<UserDTO | null>
  delete(params: { id: string }): ServiceResponse<UserDTO | null>
}
