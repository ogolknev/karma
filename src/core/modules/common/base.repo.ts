import { FindOptions, FindResult, RepoResult } from "./types";

export interface BaseRepo<T, U> {
  add(data: T): Promise<RepoResult<T>>;
  getById(id: string): Promise<RepoResult<T | null>>;
  find(query?: string, options?: FindOptions): Promise<FindResult<T>>;
  update(id: string, data: U): Promise<RepoResult<T | null>>;
  delete(id: string): Promise<RepoResult<T | null>>;
}
