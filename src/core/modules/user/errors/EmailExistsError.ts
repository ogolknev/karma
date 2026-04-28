export class EmailExistsError extends Error {
  constructor(email: string) {
    super(`Email ${email} already exists`);
    this.name = "EmailExistsError";
  }
}
