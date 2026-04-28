import { EmailSendParams } from "./types";

export interface EmailProvider {
  send(options: EmailSendParams): Promise<void>;
}
