export interface UserService {
  create(params: { data: any }): any;
  get(params: { id: string }): any;
  get(params: { ids?: string[], pagination?: any, sorting?: any, search?: any }): any;
  update(params: { id: string, data: any }): any
  delete(params: { id: string }): any
}
