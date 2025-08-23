export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User (${id}) isn't exists`)
    this.name = "UserNotFound"
  }
}