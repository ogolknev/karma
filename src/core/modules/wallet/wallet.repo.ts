import { BaseRepo } from "../common";
import { WalletUpdateDTO } from "./dto";
import { Wallet } from "./wallet.entity";

export interface WalletRepo extends BaseRepo<Wallet, WalletUpdateDTO> {}