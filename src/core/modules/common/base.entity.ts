function abstractCreate(
  _data: any
): Promise<any> {
  throw new Error("Not implemented");
}

export abstract class BaseEntity<UpdateDTO extends object> {
  static create = abstractCreate;
  abstract update(data: UpdateDTO): void;
}
