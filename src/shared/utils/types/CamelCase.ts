export type CamelCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${First}${Capitalize<CamelCase<Rest>>}`
    : S;
