import { UserUpdateDTO } from "../dto";
import { UserNotFoundError } from "../errors";
import { UserRepo } from "../user.repo";

export class UserUpdate {
  constructor(private userRepo: UserRepo) {}

  async execute(id: string, data: UserUpdateDTO) {
    const isUsernameExists = Boolean(
      await this.userRepo.getById(id)
    );

    if (!isUsernameExists) throw new UserNotFoundError(id)

    const result = await this.userRepo.getById(id)
    const user = result.data

    user.update(data)
    return this.userRepo.update(id, user)
  }
}