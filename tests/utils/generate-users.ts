import "../setup";
import { DrizzleUserService, type UserService } from "../../src/modules/user/service";
import type { UserDTO } from "../../src/modules/user/model";

const userService: UserService = new DrizzleUserService();

export const generateTestUserData = (count: number) => {
  const userDataPool: {
    username: string;
    password: string;
  }[] = Array.from({ length: count });

  return userDataPool.map((_, index) => ({
    username: `test_username_${index}`,
    password: `test_password_${index}`,
  }));
};

export async function generateTestUsers(count: number) {
  const testUserData = generateTestUserData(count);
  const createdUsers: UserDTO[] = [];

  for (const data of testUserData) {
    createdUsers.push((await userService.create({ data })).data)
  }

  return createdUsers;
}
