import { generateId } from "@/shared/utils/crypto";
import { BaseEntity } from "../common";
import { TransactionCreateDTO } from "./dto";
import { TransactionType } from "./types/TransactionType";
import { toDatetimeString } from "@/shared/utils/date";
import { BaseTransactionDTO } from "./dto/BaseTransactionDTO";

export class Transaction extends BaseEntity<{}> {
  constructor(
    public id: string,
    public fromId: string,
    public toId: string,
    public type: TransactionType,
    public amount: number,
    public createdAt: Date,
    public taskId: string | null = null
  ) {
    super();
  }

  static async create(data: TransactionCreateDTO) {
    const id = generateId();
    const createdAt = new Date();

    return new Transaction(
      id,
      data.fromId,
      data.toId,
      data.type,
      data.amount,
      createdAt,
      data.taskId
    );
  }

  static fromDTO({ data }: { data: BaseTransactionDTO }) {
    return new Transaction(
      data.id,
      data.fromId,
      data.toId,
      data.type,
      data.amount,
      data.createdAt,
      data.taskId
    );
  }

  /**
   * Method not allowed!
   */
  update(_data: {}): void {
    throw new Error("Method not allowed.");
  }

  toDTO(): BaseTransactionDTO {
    return {
      id: this.id,
      fromId: this.fromId,
      toId: this.toId,
      type: this.type,
      amount: this.amount,
      createdAt: this.createdAt,
      taskId: this.taskId,
    };
  }
}
