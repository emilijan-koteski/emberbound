import { describe, expect, it } from 'vitest';
import { CONFIG } from '../sim/config.ts';
import { computeTilePx } from './overlay.ts';

const { width, height } = CONFIG.view;

describe('computeTilePx', () => {
  it('is about 101 px at 1920 × 1080 (DESIGN.md), from CONFIG.view', () => {
    const tile = computeTilePx(1920, 1080, CONFIG.view);
    expect(tile).toBeCloseTo(Math.min(1920 / width, 1080 / height), 10);
    expect(Math.abs(tile - 101)).toBeLessThan(0.5);
  });

  it('is about 67 px at 1280 × 720, the itch.io embed (DESIGN.md)', () => {
    const tile = computeTilePx(1280, 720, CONFIG.view);
    expect(tile).toBeCloseTo(Math.min(1280 / width, 720 / height), 10);
    expect(Math.abs(tile - 67)).toBeLessThan(0.5);
  });

  it('is limited by the width at 4:3 and by the height at 21:9', () => {
    expect(computeTilePx(1440, 1080, CONFIG.view)).toBeCloseTo(1440 / width, 10);
    expect(computeTilePx(2560, 1080, CONFIG.view)).toBeCloseTo(1080 / height, 10);
  });

  it('adds the margin on both sides of each axis', () => {
    const view = { width: 19, height: 10.4, margin: 1 };
    expect(computeTilePx(1920, 1080, view)).toBeCloseTo(Math.min(1920 / 21, 1080 / 12.4), 10);
  });
});
