export interface BaseUserDTO {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  passwordHash: string;
}
