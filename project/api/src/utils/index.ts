export function parseQuery(item: string | string[] | undefined, defaultValue: string = ''): [string, string[]] {
  if (Array.isArray(item)) return [item[0], item];
  if (item) return [item, []]
  return [defaultValue, []]
}
