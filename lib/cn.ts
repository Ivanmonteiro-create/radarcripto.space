// /lib/cn.ts
// Junta classes ignorando valores "falsy" (false, null, undefined, "")
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
