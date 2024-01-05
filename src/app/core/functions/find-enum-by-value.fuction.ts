export function findEnumByValueFn<T, Q extends keyof T>(entityType: T, val: Q): T[Q] {
   return entityType[
     Object.entries(entityType)
     .find(([key, value]) => val === value)[0]
     ];
}
