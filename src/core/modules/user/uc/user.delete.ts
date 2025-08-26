import { UserRepo } from "../user.repo";

export class UserDelete {
  constructor(private userRepo: UserRepo) {}

  async execute(id: string) {
    return await this.userRepo.delete(id)
  }
}