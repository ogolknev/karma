import { EmailProvider } from "./email";

export class DIContainer {
    private static _email: EmailProvider;

    static get email() {
        if (!this._email) throw new Error("Uninitialized DI container");

        return this._email;
    }

    static init(email: EmailProvider) {
        this._email = email;
    }
}
