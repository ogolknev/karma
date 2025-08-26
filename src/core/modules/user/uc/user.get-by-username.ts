import { UserRepo } from "../user.repo";

export class UserGetByUsername {
  constructor(private userRepo: UserRepo) {}

  async execute(username: string) {
    return await this.userRepo.getByUsername(username)
  }
}