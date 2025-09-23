import { BaseEntity, BaseRepo } from "@/core/modules/common";
import { expect, it } from "bun:test";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

async function shouldStartsAndFillsDB({
  db,
  repo,
}: {
  db: NodePgDatabase<any>;
  repo: BaseRepo<any, any, any>;
}) {
  expect(db).not.toBeUndefined();
  expect(repo).not.toBeUndefined();
}

async function shouldCreates<T extends BaseEntity<any> & { id: string }>({
  entity,
  repo,
}: {
  entity: T;
  repo: BaseRepo<T, any, any>;
}) {
  const { data: created } = await repo.add({ data: entity });

  expect(entity.toDTO()).toEqual(created.toDTO());

  await repo.delete({ id: created.id });
}

async function shouldGetsById<T extends BaseEntity<any> & { id: string }>({
  entity,
  repo,
}: {
  entity: T;
  repo: BaseRepo<T, any, any>;
}) {
  const { data: received } = await repo.getById({ id: entity.id });

  expect(received?.toDTO()).toEqual(entity.toDTO());
}

async function shouldGetSpecifiedNumber<
  T extends BaseEntity<any> & { id: string }
>({
  repo,
  number = 5,
  total,
}: {
  repo: BaseRepo<T, any, any>;
  number?: number;
  total: number;
}) {
  const { data: received, meta } = await repo.find({
    options: { pagination: { limit: number } },
  });

  expect(received.length).toBe(number);
  expect(meta?.pagination.limit).toBe(number);
  expect(meta?.pagination.offset).toBe(0);
  expect(meta?.pagination.total).toBe(total);
}

async function shouldGetsAllWithPagination<
  T extends BaseEntity<any> & { id: string }
>({
  all,
  repo,
  number = 5,
}: {
  all: T[];
  repo: BaseRepo<T, any, any>;
  number?: number;
}) {
  let offset = 0;

  const entities: T[] = [];
  let fetchedNumber = 0;
  do {
    const { data: newEntities } = await repo.find({
      options: { pagination: { offset, limit: number } },
    });
    offset += number;
    fetchedNumber = newEntities.length;
    entities.push(...newEntities);
  } while (fetchedNumber !== 0);

  expect(entities).toEqual(expect.arrayContaining(all));
  expect(entities.length).toBe(all.length);
}

async function shouldUpdates<T extends BaseEntity<any> & { id: string }>({
  entity,
  repo,
  field,
  newValue = "newValue",
}: {
  entity: T;
  repo: BaseRepo<T, any, any>;
  field: keyof T;
  newValue?: any;
}) {
  const { data: beforeUpdate } = await repo.getById({
    id: entity.id,
  });

  await repo.update({ id: entity.id, data: { [field]: newValue } });

  const { data: afterUpdate } = await repo.getById({
    id: entity.id,
  });

  expect(beforeUpdate).not.toBeNull();
  expect(afterUpdate).not.toBeNull();
  expect(beforeUpdate?.toDTO()).not.toEqual(afterUpdate?.toDTO());
  expect(afterUpdate?.[field]).toBe(newValue);
}

async function shouldDeletes<T extends BaseEntity<any> & { id: string }>({
  entity,
  repo,
}: {
  entity: T;
  repo: BaseRepo<T, any, any>;
}) {
  await repo.delete({ id: entity.id });

  const { data: received } = await repo.getById({ id: entity.id });

  expect(received).toBeNull();

  await repo.add({ data: entity });
}

export async function shouldCRUD<
  T extends BaseEntity<any> & { id: string },
  K extends keyof T
>({
  entityName,
  entities,
  entityToAdd,
  repo,
  fieldForUpdate,
  valueForUpdate,
  db,
}: {
  entityName: [string, string];
  entities: T[];
  entityToAdd: T;
  repo: BaseRepo<T, any, any>;
  fieldForUpdate?: K;
  valueForUpdate?: T[K];
  db: NodePgDatabase<any>;
}) {
  const entity = entities[0];

  it(`Starts and fills database for test ${entityName[0]} repository`, async () =>
    await shouldStartsAndFillsDB({ db, repo }));
  it(`Creates ${entityName[0]}`, async () =>
    await shouldCreates({ entity: entityToAdd, repo }));
  it(`Gets ${entityName[0]} by ID`, async () =>
    await shouldGetsById({ entity, repo }));
  it(`Gets specified number of ${entityName[1]}`, async () =>
    shouldGetSpecifiedNumber({ repo, total: entities.length }));
  it(`Gets all ${entityName[1]} with pagination`, async () =>
    await shouldGetsAllWithPagination({ all: entities, repo }));
  if (fieldForUpdate) {
    it(`Updates ${entityName[0]}`, async () =>
      await shouldUpdates({
        entity,
        repo,
        field: fieldForUpdate,
        newValue: valueForUpdate,
      }));
  }
  it(`Deletes ${entityName[0]}`, async () =>
    await shouldDeletes({ entity, repo }));
}
