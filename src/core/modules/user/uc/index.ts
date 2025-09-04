import { createUCs } from "../../common/uc";
import { User } from "../user.entity";
import { UserGetByUsername } from "./user.get-by-username";

export const userUCs = createUCs(User, {
  extraUCs: {
    GetByUsername: UserGetByUsername
  }
})