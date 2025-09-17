export class NotCreatedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NotCreated"
  }
}