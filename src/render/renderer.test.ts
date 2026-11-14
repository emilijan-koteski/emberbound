// three.js core runs in Node; no WebGLRenderer is created here.
import { BoxGeometry, Mesh, MeshBasicMaterial, Scene, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { cappedPixelRatio, estimateTextureBytes, MAX_PIXEL_RATIO } from './renderer.ts';

function sizedTexture(width: number, height: number): Texture {
  // A plain object stands in for an image: the estimate reads only its width and height.
  return new Texture({ width, height });
}

const RGBA_BYTES = 4;
const MIPMAP_FACTOR = 4 / 3;

describe('cappedPixelRatio', () => {
  it('caps a high-density screen at MAX_PIXEL_RATIO', () => {
    expect(cappedPixelRatio(2)).toBe(MAX_PIXEL_RATIO);
    expect(cappedPixelRatio(MAX_PIXEL_RATIO + 0.01)).toBe(MAX_PIXEL_RATIO);
  });

  it('passes a ratio at or under the cap through', () => {
    expect(cappedPixelRatio(1)).toBe(1);
    expect(cappedPixelRatio(1.25)).toBe(1.25);
    expect(cappedPixelRatio(MAX_PIXEL_RATIO)).toBe(MAX_PIXEL_RATIO);
  });

  it('falls back to 1 for a ratio that is not a positive finite number', () => {
    expect(cappedPixelRatio(Number.NaN)).toBe(1);
    expect(cappedPixelRatio(0)).toBe(1);
    expect(cappedPixelRatio(-1)).toBe(1);
    expect(cappedPixelRatio(Number.POSITIVE_INFINITY)).toBe(1);
  });
});

describe('estimateTextureBytes', () => {
  it('is 0 for an empty scene', () => {
    expect(estimateTextureBytes(new Scene())).toBe(0);
  });

  it('counts width × height × 4 bytes, × 4/3 with mipmaps', () => {
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: sizedTexture(256, 256) })));
    expect(estimateTextureBytes(scene)).toBeCloseTo(256 * 256 * RGBA_BYTES * MIPMAP_FACTOR, 6);
  });

  it('drops the mipmap factor when mipmaps are off', () => {
    const texture = sizedTexture(128, 64);
    texture.generateMipmaps = false;
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: texture })));
    expect(estimateTextureBytes(scene)).toBe(128 * 64 * RGBA_BYTES);
  });

  it('counts a texture shared by two meshes once', () => {
    const texture = sizedTexture(64, 64);
    texture.generateMipmaps = false;
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: texture })));
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ alphaMap: texture })));
    expect(estimateTextureBytes(scene)).toBe(64 * 64 * RGBA_BYTES);
  });

  it('walks a material array and nested objects', () => {
    const a = sizedTexture(32, 32);
    const b = sizedTexture(16, 16);
    a.generateMipmaps = false;
    b.generateMipmaps = false;
    const parent = new Mesh(new BoxGeometry(), [
      new MeshBasicMaterial({ map: a }),
      new MeshBasicMaterial({ map: b }),
    ]);
    const scene = new Scene();
    const group = new Scene();
    group.add(parent);
    scene.add(group);
    expect(estimateTextureBytes(scene)).toBe((32 * 32 + 16 * 16) * RGBA_BYTES);
  });

  it('counts the scene background and environment textures', () => {
    const background = sizedTexture(8, 8);
    const environment = sizedTexture(4, 4);
    background.generateMipmaps = false;
    environment.generateMipmaps = false;
    const scene = new Scene();
    scene.background = background;
    scene.environment = environment;
    expect(estimateTextureBytes(scene)).toBe((8 * 8 + 4 * 4) * RGBA_BYTES);
  });

  it('counts a texture with no sized image as 0', () => {
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: new Texture() })));
    expect(estimateTextureBytes(scene)).toBe(0);
  });

  it('counts clones that share one source once', () => {
    const texture = sizedTexture(64, 64);
    texture.generateMipmaps = false;
    const clone = texture.clone();
    clone.offset.set(0.5, 0);
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: texture })));
    scene.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial({ map: clone })));
    expect(estimateTextureBytes(scene)).toBe(64 * 64 * RGBA_BYTES);
  });

  it('walks shader uniforms, arrays of textures included, and skips empty uniforms', () => {
    const single = sizedTexture(8, 8);
    const listed = sizedTexture(4, 4);
    single.generateMipmaps = false;
    listed.generateMipmaps = false;
    // ShaderMaterial lives only in render/materials/ (ESLint), so a material carrying a `uniforms`
    // map stands in for one. An entry left undefined must not throw.
    const material = Object.assign(new MeshBasicMaterial(), {
      uniforms: {
        single: { value: single },
        list: { value: [listed, null] },
        none: { value: null },
        missing: undefined,
      },
    });
    const scene = new Scene();
    scene.add(new Mesh(new BoxGeometry(), material));
    expect(estimateTextureBytes(scene)).toBe((8 * 8 + 4 * 4) * RGBA_BYTES);
  });

  it("counts the scene's override material", () => {
    const texture = sizedTexture(16, 16);
    texture.generateMipmaps = false;
    const scene = new Scene();
    scene.overrideMaterial = new MeshBasicMaterial({ map: texture });
    expect(estimateTextureBytes(scene)).toBe(16 * 16 * RGBA_BYTES);
  });

  it('multiplies by depth for 3D and array textures', () => {
    const texture = new Texture({ width: 8, height: 8, depth: 4 });
    texture.generateMipmaps = false;
    const scene = new Scene();
    scene.background = texture;
    expect(estimateTextureBytes(scene)).toBe(8 * 8 * 4 * RGBA_BYTES);
  });

  it("reads a video's intrinsic size", () => {
    const texture = new Texture({ width: 0, height: 0, videoWidth: 32, videoHeight: 16 });
    texture.generateMipmaps = false;
    const scene = new Scene();
    scene.background = texture;
    expect(estimateTextureBytes(scene)).toBe(32 * 16 * RGBA_BYTES);
  });
});
