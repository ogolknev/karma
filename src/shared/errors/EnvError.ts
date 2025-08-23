export class EnvError extends Error {
  constructor(public key: string) {
    super(`Failed to load environment variable ${key}`);
    this.name = "EnvError";
  }
}
