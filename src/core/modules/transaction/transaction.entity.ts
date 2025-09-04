import { generateId } from "@/shared/utils/crypto";
import { BaseEntity } from "../common";
import { TransactionCreateDTO } from "./dto";
import { TransactionType } from "./types/TransactionType";
import { toDatetimeString } from "@/shared/utils/date";

export class Transaction extends BaseEntity<{}> {
  constructor(
    private id: string,
    private fromId: string,
    private toId: string,
    private type: TransactionType,
    private amount: number,
    private createdAt: string,
    private taskId?: string
  ) {
    super();
  }

  static async create(date: TransactionCreateDTO) {
    const id = generateId();
    const createdAt = toDatetimeString(new Date());

    return new Transaction(
      id,
      date.fromId,
      date.toId,
      date.type,
      date.amount,
      createdAt,
      date.taskId
    );
  }

  /**
   * Method not allowed!
   */
  update(data: {}): void {
    throw new Error("Method not allowed.");
  }
}
