import { BaseUC } from "../../common/uc";
import { UserRepo } from "../user.repo";

export class UserGetByUsername extends BaseUC<UserRepo> {
  async execute(username: string) {
    return await this.repo.getByUsername(username)
  }
}