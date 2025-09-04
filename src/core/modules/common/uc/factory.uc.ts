import { BaseEntity } from "../base.entity";
import { BaseRepo } from "../base.repo";
import { FindOptions } from "../types";
import { BaseUC } from "./base.uc";

type UCContructor<Repo extends BaseRepo<any, any>> = new (
  repo: Repo,
  ...args: any[]
) => BaseUC<Repo>;
type UCs<Repo extends BaseRepo<any, any>> = Record<string, UCContructor<Repo>>;

export function createUCs<
  CreateDTO extends object,
  UpdateDTO extends object,
  Entity extends BaseEntity<UpdateDTO>,
  Repo extends BaseRepo<Entity, UpdateDTO>,
  ExtraUCs extends UCs<any> = {}
>(
  entityCls: {
    new (...args: any[]): Entity;
    create: (data: CreateDTO) => Promise<Entity>;
  },
  options: {
    extraUCs?: ExtraUCs;
  } = {}
) {
  class Create extends BaseUC<Repo> {
    async execute({ data }: { data: CreateDTO }) {
      const entity = await entityCls.create(data);

      return await this.repo.add({ data: entity });
    }
  }

  class Update extends BaseUC<Repo> {
    async execute({ id, data }: { id: string; data: UpdateDTO }) {
      return await this.repo.update({ id, data });
    }
  }

  class GetById extends BaseUC<Repo> {
    async execute({ id }: { id: string }) {
      return await this.repo.getById({ id });
    }
  }

  class Find extends BaseUC<Repo> {
    async execute({
      query,
      options,
    }: {
      query?: string;
      options?: FindOptions;
    }) {
      return await this.repo.find({ query, options });
    }
  }

  class Delete extends BaseUC<Repo> {
    async execute({ id }: { id: string }) {
      return await this.repo.delete({ id });
    }
  }

  return {
    Create,
    GetById,
    Find,
    Update,
    Delete,
    ...(options.extraUCs ?? <ExtraUCs>{}),
  };
}
