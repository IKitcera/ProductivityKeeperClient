export function findEnumByValueFn<T, Q extends keyof T>(value: Q): T[Q] {
   return T[
     Object.entries(T)
     .find(([key, value]) => value === value)[0]
     ];
}
