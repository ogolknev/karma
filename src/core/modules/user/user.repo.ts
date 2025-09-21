import type { BaseRepo } from "../common";
import { RepoResult } from "../common/types";
import { BaseUserDTO, UserUpdateDTO } from "./dto";
import { User } from "./user.entity";

export interface UserRepo extends BaseRepo<User, BaseUserDTO, UserUpdateDTO> {
  getByUsername(username: string): Promise<RepoResult<User | null>>;
}
