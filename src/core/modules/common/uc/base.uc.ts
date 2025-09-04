import { BaseRepo } from "../base.repo";

export abstract class BaseUC<R extends BaseRepo<any, any>> {
  constructor(protected repo: R) {}

  abstract execute(...args: any[]): Promise<any>
}