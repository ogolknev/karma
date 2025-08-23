import { FindOptions, FindResult, RepoResult } from "../common/types";
import { User } from "./user.entity";

export interface UserRepo {
  add(data: User): Promise<RepoResult<User>>;

  getById(id: string): Promise<RepoResult<User>>;
  getByUsername(username: string): Promise<RepoResult<User>>;

  findByWorkspace(
    workspaceId: string,
    options: FindOptions
  ): Promise<FindResult<User>>;
  findBySearch(query: string, options: FindOptions): Promise<FindResult<User>>;

  update(id: string, data: User): Promise<RepoResult<User>>;

  delete(id: string): Promise<void>
}
