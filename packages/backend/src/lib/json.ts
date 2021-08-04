export function parse<T>(jsonString: string): T {
  return JSON.parse(jsonString) as T;
}
