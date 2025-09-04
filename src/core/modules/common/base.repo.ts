import { FindOptions, FindResult, RepoResult } from "./types";

export interface BaseRepo<Entity, UpdateDTO> {
  add({ data }: { data: Entity }): Promise<RepoResult<Entity>>;
  getById({ id }: { id: string }): Promise<RepoResult<Entity | null>>;
  find({
    query,
    options,
  }: {
    query?: string;
    options?: FindOptions;
  }): Promise<FindResult<Entity>>;
  update({
    id,
    data,
  }: {
    id: string;
    data: UpdateDTO;
  }): Promise<RepoResult<Entity | null>>;
  delete({ id }: { id: string }): Promise<RepoResult<Entity | null>>;
}
