import { FindOptions, FindResult, RepoResult } from "../common/types";
import { UserUpdateDTO } from "./dto";
import { User } from "./user.entity";

export interface UserRepo {
  add(data: User): Promise<RepoResult<User>>;

  getById(id: string): Promise<RepoResult<User | null>>;
  getByUsername(username: string): Promise<RepoResult<User | null>>;

  findByWorkspace(
    workspaceId: string,
    options: FindOptions
  ): Promise<FindResult<User>>;
  findBySearch(query: string, options: FindOptions): Promise<FindResult<User>>;

  update(id: string, data: UserUpdateDTO): Promise<RepoResult<User | null>>;

  delete(id: string): Promise<RepoResult<User | null>>
}
