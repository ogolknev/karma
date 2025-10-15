function abstractCreate<
  Entity extends BaseEntity<any>,
  CreateDTO extends object
>(_data: CreateDTO): Promise<Entity> {
  throw new Error("Not implemented");
}

function abstractFromDTO<
  Entity extends BaseEntity<any>,
  BaseDTO extends object
>({ data }: { data: BaseDTO }): Entity {
  throw new Error("Not implemented");
}

export abstract class BaseEntity<
  UpdateDTO extends object = any,
  BaseDTO extends object = any
> {
  static create = abstractCreate<BaseEntity<any, any>, any>;
  static fromDTO = abstractFromDTO<BaseEntity<any, any>, any>;
  abstract update(data: UpdateDTO): void;
  abstract toDTO(): BaseDTO;

  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
