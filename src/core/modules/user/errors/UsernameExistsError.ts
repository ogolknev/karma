export class UsernameExistsError extends Error {
  constructor(username: string) {
    super(`Username ${username} is already exists`)
    this.name = "UsernameExistsError"
  }
}