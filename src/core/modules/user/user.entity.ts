import { generateId, hashPassword } from "@/shared/utils/crypto";
import { UserUpdateDTO } from "./dto";

export class User {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    private passwordHash: string
  ) {}

  static async create(name: string, username: string, password: string) {
    const id = generateId();
    const passwordHash = await hashPassword(password);

    return new User(id, name, username, passwordHash);
  }

  getPasswordHash() {
    return this.passwordHash;
  }

  update(data: UserUpdateDTO) {
    this.name = data.name ?? this.name
  }
}
