import { BaseWalletDTO } from "./BaseWalletDTO";

export type WalletUpdateDTO = Partial<Omit<BaseWalletDTO, "id" | "userId">>