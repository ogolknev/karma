import {
  generateId,
  hashPassword,
  verifyPassword,
} from "@/shared/utils/crypto";
import { BaseUserDTO, UserCreateDTO, UserUpdateDTO } from "./dto";
import { BaseEntity } from "../common";

export class User extends BaseEntity<UserUpdateDTO> {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public username: string,
    private passwordHash: string
  ) {
    super();
  }

  static async create(data: UserCreateDTO) {
    const id = generateId();
    const passwordHash = await hashPassword(data.password);

    return new User(id, data.name, data.email, data.username, passwordHash);
  }

  static fromDTO({ data }: { data: BaseUserDTO }) {
    return new User(
      data.id,
      data.name,
      data.email,
      data.username,
      data.passwordHash
    );
  }

  update(data: UserUpdateDTO) {
    this.name = data.name ?? this.name;
  }

  toDTO(): BaseUserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      passwordHash: this.passwordHash,
    };
  }

  async verify(password: string) {
    return verifyPassword(this.passwordHash, password);
  }
}
