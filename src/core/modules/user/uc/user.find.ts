import { FindOptions } from "../../common/types";
import { UserRepo } from "../user.repo";

export class UserFind {
  constructor(private userRepo: UserRepo) {}

  async execute(query?: string, options?: FindOptions) {
    return this.userRepo.find(query, options)
  }
}