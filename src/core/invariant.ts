// invariant() for bugs (architecture, Error Handling; project-context, Failures): a condition that can
// only be false if the code is wrong. Expected failures return a Result instead. Pure: no DOM, no
// three.js, no logging (the caller's frame loop or test reports the thrown error).

/** Throws `Invariant failed: <message>` when `condition` is falsy; narrows it to truthy otherwise. */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Invariant failed: ${message}`);
}
