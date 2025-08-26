import { UserRepo } from "../user.repo";

export class UserGetById {
  constructor(private userRepo: UserRepo) {}

  async execute(id: string) {
    return await this.userRepo.getById(id)
  }
}