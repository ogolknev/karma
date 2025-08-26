import { UserUpdateDTO } from "../dto";
import { UserRepo } from "../user.repo";

export class UserUpdate {
  constructor(private userRepo: UserRepo) {}

  async execute(id: string, data: UserUpdateDTO) {
    return this.userRepo.update(id, data)
  }
}