import { UserCreateDTO } from "../dto";
import { UsernameExistsError } from "../errors";
import { User } from "../user.entity";
import { UserRepo } from "../user.repo";

export class UserCreate {
  constructor(private userRepo: UserRepo) {}

  async execute(data: UserCreateDTO) {
    if (await this.userRepo.getByUsername(data.username) !== null)
      throw new UsernameExistsError(data.username);

    const user = await User.create(
      data.username,
      data.name,
      data.password
    );

    return this.userRepo.add(user);
  }
}
