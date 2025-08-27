import { BaseRepo } from "../common";
import { RepoResult } from "../common/types";
import { UserUpdateDTO } from "./dto";
import { User } from "./user.entity";

export interface UserRepo extends BaseRepo<User, UserUpdateDTO> {
  getByUsername(username: string): Promise<RepoResult<User | null>>;
}
