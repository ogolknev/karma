import { snakeToCamelCase } from "../string";
import { CamelCase } from "../types";

export function keysFromSnakeToCamel<T extends object>(
  obj: T
): { [K in keyof T as CamelCase<K & string>]: T[K] } {
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      result[camelKey] = obj[key];
    }
  }
  return result as { [K in keyof T as CamelCase<K & string>]: T[K] };
}
