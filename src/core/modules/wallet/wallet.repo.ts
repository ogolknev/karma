import { BaseRepo } from "../common";
import { WalletUpdateDTO } from "./dto";
import { BaseWalletDTO } from "./dto/BaseWalletDTO";
import { Wallet } from "./wallet.entity";

export interface WalletRepo
  extends BaseRepo<Wallet, BaseWalletDTO, WalletUpdateDTO> {}
