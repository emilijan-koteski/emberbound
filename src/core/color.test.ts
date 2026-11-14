import { describe, expect, it } from 'vitest';
import { hsl, parseHex, relativeLuminance } from './color.ts';

describe('parseHex', () => {
  it('reads #RRGGBB and #RRGGBBAA in either case', () => {
    expect(parseHex('#FF8000')).toEqual({ r: 255, g: 128, b: 0, a: 1 });
    expect(parseHex('#ff800080')).toEqual({ r: 255, g: 128, b: 0, a: 128 / 255 });
  });

  it('returns null for anything else', () => {
    for (const bad of ['FF8000', '#FFF', '#GG0000', '#FF80001', '', 'red']) {
      expect(parseHex(bad)).toBeNull();
    }
  });
});

describe('relativeLuminance', () => {
  it('is 0 for black, 1 for white, and follows the WCAG weights for the primaries', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 10);
    expect(relativeLuminance({ r: 255, g: 0, b: 0 })).toBeCloseTo(0.2126, 10);
    expect(relativeLuminance({ r: 0, g: 255, b: 0 })).toBeCloseTo(0.7152, 10);
    expect(relativeLuminance({ r: 0, g: 0, b: 255 })).toBeCloseTo(0.0722, 10);
  });
});

describe('hsl', () => {
  it('gives the primaries their hues at full saturation and half lightness', () => {
    expect(hsl('#FF0000')).toEqual({ hueDegrees: 0, saturation: 1, lightness: 0.5 });
    expect(hsl('#00FF00')).toEqual({ hueDegrees: 120, saturation: 1, lightness: 0.5 });
    expect(hsl('#0000FF')).toEqual({ hueDegrees: 240, saturation: 1, lightness: 0.5 });
  });

  it('keeps hues in [0, 360): magenta-red is near 360, not negative', () => {
    expect(hsl('#FF00FF').hueDegrees).toBe(300);
    const nearRed = hsl('#FF0010').hueDegrees;
    expect(nearRed).toBeGreaterThan(355);
    expect(nearRed).toBeLessThan(360);
  });

  it('gives an achromatic colour hue 0 and saturation 0', () => {
    expect(hsl('#808080')).toEqual({ hueDegrees: 0, saturation: 0, lightness: 128 / 255 });
    expect(hsl('#000000')).toEqual({ hueDegrees: 0, saturation: 0, lightness: 0 });
    expect(hsl('#FFFFFF')).toEqual({ hueDegrees: 0, saturation: 0, lightness: 1 });
  });

  it('does not round: an orange keeps its exact hue and saturation', () => {
    // #E0A86A: max 224, min 106, so lightness 165/255 and saturation 118 / (510 − 330).
    const { hueDegrees, saturation, lightness } = hsl('#E0A86A');
    expect(lightness).toBeCloseTo(165 / 255, 12);
    expect(saturation).toBeCloseTo(118 / 180, 12);
    expect(hueDegrees).toBeCloseTo((60 * (168 - 106)) / 118, 12);
  });

  it('keeps saturation within 0 to 1 despite float error (#FFFBFD computes to 1.000000000000007)', () => {
    expect(hsl('#FFFBFD').saturation).toBe(1);
    expect(hsl('#040002').saturation).toBe(1);
  });

  it('throws on anything but an opaque #RRGGBB colour', () => {
    for (const bad of ['#FF000080', '#FFF', 'FF0000', '']) {
      expect(() => hsl(bad)).toThrow(/#RRGGBB/);
    }
  });
});
