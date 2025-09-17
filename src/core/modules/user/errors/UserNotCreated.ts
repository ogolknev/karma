export class UserNotCreatedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserNotCreated"
  }
}