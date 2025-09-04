import { generateId, hashPassword } from "@/shared/utils/crypto";
import { UserCreateDTO, UserUpdateDTO } from "./dto";
import { BaseEntity } from "../common";

export class User extends BaseEntity<UserUpdateDTO> {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    private passwordHash: string
  ) {
    super();
  }

  static async create(data: UserCreateDTO) {
    const id = generateId();
    const passwordHash = await hashPassword(data.password);

    return new User(id, data.name, data.username, passwordHash);
  }

  getPasswordHash() {
    return this.passwordHash;
  }

  update(data: UserUpdateDTO) {
    this.name = data.name ?? this.name;
  }
}
