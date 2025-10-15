import { generateId } from "@/shared/utils/crypto";
import { BaseEntity } from "../common";
import { WalletCreateDTO, WalletUpdateDTO } from "./dto";
import { BaseWalletDTO } from "./dto/BaseWalletDTO";

export class Wallet extends BaseEntity<WalletUpdateDTO> {
  constructor(
    id: string,
    public userId: string,
    public karma: number,
    public respect: number
  ) {
    super(id);
  }

  static async create(data: WalletCreateDTO) {
    const id = generateId();

    return new Wallet(id, data.userId, 0, 0);
  }

  static fromDTO({ data }: { data: BaseWalletDTO }) {
    return new Wallet(data.id, data.userId, data.karma, data.respect);
  }

  update(data: WalletUpdateDTO): void {
    this.karma = data.karma ?? this.karma;
    this.respect = data.respect ?? this.respect;
  }

  toDTO(): BaseWalletDTO {
    return {
      id: this.id,
      userId: this.userId,
      karma: this.karma,
      respect: this.respect,
    };
  }
}
