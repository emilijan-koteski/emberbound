import type { Browser, Page } from '@playwright/test';

// Reading what the screen shows, for the look-dev checks (stories 0.9 and 0.10): a screenshot of a
// small region, decoded in a blank page's canvas (no image library needed). The viewport's device
// scale factor is 1 (Playwright's default), so a CSS pixel is one screenshot pixel; the staging check
// asserts it. Not a test file: Playwright's default testMatch skips it.

export type Rgb = readonly [number, number, number];

/** A `#RRGGBB` hex value as its three channels. */
export function channels(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1, 7), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/** The pixels of a `width` × `height` page region, row by row, left to right. */
async function regionAt(
  page: Page,
  browser: Browser,
  clip: { x: number; y: number; width: number; height: number },
): Promise<Rgb[]> {
  const png = await page.screenshot({ clip });
  const decoder = await browser.newPage();
  try {
    return await decoder.evaluate(
      async ({ base64, width, height }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context === null) throw new Error('no 2D context');
        context.drawImage(image, 0, 0);
        const { data } = context.getImageData(0, 0, width, height);
        const pixels: [number, number, number][] = [];
        for (let i = 0; i < data.length; i += 4) {
          pixels.push([data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0]);
        }
        return pixels;
      },
      { base64: png.toString('base64'), width: clip.width, height: clip.height },
    );
  } finally {
    await decoder.close();
  }
}

/** The colour at a page pixel, as the screen shows it. */
export async function pixelAt(page: Page, browser: Browser, x: number, y: number): Promise<Rgb> {
  const pixel = (await regionAt(page, browser, { x, y, width: 1, height: 1 })).at(0);
  if (pixel === undefined) throw new Error(`no pixel at ${String(x)}, ${String(y)}`);
  return pixel;
}

/** One row of page pixels, from x0 to x1 inclusive, at y. */
export function rowAt(
  page: Page,
  browser: Browser,
  y: number,
  x0: number,
  x1: number,
): Promise<Rgb[]> {
  if (!(x1 >= x0)) {
    throw new Error(`rowAt needs x1 ≥ x0, got ${String(x0)}..${String(x1)} at y ${String(y)}`);
  }
  return regionAt(page, browser, { x: x0, y, width: x1 - x0 + 1, height: 1 });
}
