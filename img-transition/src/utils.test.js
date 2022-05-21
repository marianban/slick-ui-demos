import { computeScale, restoreAspectRatio } from './utils';

describe('computeScale for square window', () => {
  test('given window has same size as texture then do not rescale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 400,
      windowHeight: 400,
    });
    expect(scale.scaleX).toBe(1);
    expect(scale.scaleY).toBe(1);
  });

  test('given window is larger than image then do not rescale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 500,
      windowHeight: 500,
    });
    expect(scale.scaleX).toBe(1);
    expect(scale.scaleY).toBe(1);
  });

  test('given only window width is larger than image then do not rescale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 500,
      windowHeight: 400,
    });
    expect(scale.scaleX).toBe(1);
    expect(scale.scaleY).toBe(1);
  });

  test('given only window height is larger than image then do not rescale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 400,
      windowHeight: 500,
    });
    expect(scale.scaleX).toBe(1);
    expect(scale.scaleY).toBe(1);
  });

  test('given window width is larger but height is smaller than image then downscale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 500,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given window height is larger but width is smaller than image then downscale', () => {
    const scale = computeScale({
      initialTextureHeight: 400,
      initialTextureWidth: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 500,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given window is smaller than image then downscale image', () => {
    const scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given only window height is smaller than image then downscale image', () => {
    const scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 400,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given only window width is smaller than image then downscale image', () => {
    const scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 400,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given window is smaller and width is the smallest then downscale image', () => {
    const scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 300,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given window is smaller and height is the smallest then downscale image', () => {
    // square image
    let scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 400,
      initialWindowWidth: 400,
      initialWindowHeight: 400,
      windowWidth: 300,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);

    // landscape image
    scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 300,
      initialWindowWidth: 400,
      initialWindowHeight: 300,
      windowWidth: 300,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.6666666666666666);
    expect(scale.scaleY).toBe(0.6666666666666666);

    // portrait image
    scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 800,
      initialWindowWidth: 400,
      initialWindowHeight: 800,
      windowWidth: 300,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.25);
    expect(scale.scaleY).toBe(0.25);
  });

  test('given landscape image and window is smaller than image then downscale image', () => {
    // same height, larger width
    let scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 200,
      initialWindowWidth: 400,
      initialWindowHeight: 200,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);

    // smaller height, larger width
    scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 100,
      initialWindowWidth: 400,
      initialWindowHeight: 100,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);

    // larger height, larger width
    scale = computeScale({
      initialTextureWidth: 400,
      initialTextureHeight: 300,
      initialWindowWidth: 400,
      initialWindowHeight: 300,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  test('given portrait image and window is smaller than image then downscale image', () => {
    // same width, larger height
    let scale = computeScale({
      initialTextureWidth: 200,
      initialTextureHeight: 400,
      initialWindowWidth: 200,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);

    // smaller width, larger height
    scale = computeScale({
      initialTextureWidth: 100,
      initialTextureHeight: 400,
      initialWindowWidth: 100,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);

    // larger width, larger height
    scale = computeScale({
      initialTextureWidth: 300,
      initialTextureHeight: 400,
      initialWindowWidth: 300,
      initialWindowHeight: 400,
      windowWidth: 200,
      windowHeight: 200,
    });
    expect(scale.scaleX).toBe(0.5);
    expect(scale.scaleY).toBe(0.5);
  });

  // test('computeScale for landscape window', () => {
  //   let scale = computeScale({
  //     initialTextureWidth: 2000,
  //     initialTextureHeight: 1125,
  //     initialWindowWidth: 1280,
  //     initialWindowHeight: 728,
  //     windowWidth: 1280,
  //     windowHeight: 728,
  //   });
  //   expect(scale.scaleX).toBe(0.989010989010989);
  //   expect(scale.scaleY).toBe(0.989010989010989);
  // });
});

describe('restoreAspectRatio', () => {
  describe('square window', () => {
    test('square image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 400,
        initialWindowWidth: 200,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(1);
    });

    test('ladscape image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 600,
        initialTextureHeight: 400,
        initialWindowWidth: 200,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1.5);
      expect(scale.scaleY).toBe(1);
    });

    test('portrait image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 600,
        initialWindowWidth: 200,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(1.5);
    });
  });

  describe('landscape window', () => {
    test('square image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 400,
        initialWindowWidth: 300,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(1.5);
    });

    test('ladscape image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 600,
        initialTextureHeight: 400,
        initialWindowWidth: 300,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(1);
    });

    test('portrait image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 600,
        initialWindowWidth: 300,
        initialWindowHeight: 200,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(2.25);
    });
  });

  describe('portrait window', () => {
    test('square image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 400,
        initialWindowWidth: 200,
        initialWindowHeight: 300,
      });
      expect(scale.scaleX).toBe(1.5);
      expect(scale.scaleY).toBe(1);
    });

    test('ladscape image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 600,
        initialTextureHeight: 400,
        initialWindowWidth: 200,
        initialWindowHeight: 300,
      });
      expect(scale.scaleX).toBe(2.25);
      expect(scale.scaleY).toBe(1);
    });

    test('portrait image', () => {
      const scale = restoreAspectRatio({
        initialTextureWidth: 400,
        initialTextureHeight: 600,
        initialWindowWidth: 200,
        initialWindowHeight: 300,
      });
      expect(scale.scaleX).toBe(1);
      expect(scale.scaleY).toBe(1);
    });
  });
});
