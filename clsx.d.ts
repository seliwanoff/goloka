declare module "clsx" {
  type ClassValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | Record<string, unknown>;

  function clsx(...args: any): string;

  export default clsx;
}
