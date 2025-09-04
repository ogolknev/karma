import { generateId } from "@/shared/utils/crypto";
import { BaseEntity } from "../common";
import { WalletCreateDTO, WalletUpdateDTO } from "./dto";

export class Wallet extends BaseEntity<WalletUpdateDTO> {
  constructor(
    private id: string,
    private userId: string,
    private karma: number,
    private respect: number
  ) {
    super();
  }

  static async create(data: WalletCreateDTO) {
    const id = generateId();

    return new Wallet(id, data.userId, 0, 0);
  }

  update(data: WalletUpdateDTO): void {
    this.karma = data.karma ?? this.karma
    this.respect = data.respect ?? this.respect
  }
}
