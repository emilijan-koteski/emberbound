import { describe, expect, it } from 'vitest';
import { invariant } from './invariant.ts';

describe('invariant', () => {
  it('returns for a truthy condition', () => {
    expect(() => {
      invariant(true, 'never shown');
    }).not.toThrow();
    expect(() => {
      invariant(1, 'never shown');
    }).not.toThrow();
  });

  it('throws an Error naming the broken rule for a falsy condition', () => {
    expect(() => {
      invariant(false, 'a lantern light in a level without lanterns');
    }).toThrow(/^Invariant failed: a lantern light in a level without lanterns$/);
    expect(() => {
      invariant(0, 'zero');
    }).toThrow(Error);
    expect(() => {
      invariant(null, 'null');
    }).toThrow('Invariant failed: null');
  });
});
