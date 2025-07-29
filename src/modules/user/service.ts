import { UserCreate, UserUpdate } from "./model";

export interface UserService {
  create(params: { data: UserCreate }): any;
  get(params: { id: string }): any;
  get(params: { ids?: string[], pagination?: any, sorting?: any, search?: any }): any;
  update(params: { id: string, data: UserUpdate }): any
  delete(params: { id: string }): any
}
