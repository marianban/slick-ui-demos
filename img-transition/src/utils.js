export const restoreAspectRatio = ({
  initialTextureWidth,
  initialTextureHeight,
  initialWindowWidth,
  initialWindowHeight,
}) => {
  let textureAspectRatio = initialTextureWidth / initialTextureHeight;
  let windowAspectRatio = initialWindowWidth / initialWindowHeight;

  let scaleX = 1;
  let scaleY = 1;

  if (
    textureAspectRatio > 1 ||
    (textureAspectRatio === 1 && windowAspectRatio < 1)
  ) {
    scaleX = textureAspectRatio / windowAspectRatio;
  } else {
    scaleY = 1 / textureAspectRatio / (1 / windowAspectRatio);
  }

  return {
    scaleX,
    scaleY,
  };
};

export const computeScale = ({
  initialTextureWidth,
  initialTextureHeight,
  initialWindowWidth,
  initialWindowHeight,
  windowWidth,
  windowHeight,
}) => {
  // console.log({
  //   initialTextureWidth,
  //   initialTextureHeight,
  //   initialWindowWidth,
  //   initialWindowHeight,
  //   windowWidth,
  //   windowHeight,
  // });

  const { scaleX: aScaleX, scaleY: aScaleY } = restoreAspectRatio({
    initialTextureWidth,
    initialTextureHeight,
    initialWindowWidth,
    initialWindowHeight,
  });

  const textureWidth = initialWindowWidth * aScaleX;
  const textureHeight = initialWindowHeight * aScaleY;

  let scale = 1;

  if (textureWidth > windowWidth || textureHeight > windowHeight) {
    const scaleX = windowWidth / textureWidth;
    const scaleY = windowHeight / textureHeight;
    scale = Math.min(scaleX, scaleY);
  }

  return {
    scaleX: aScaleX * scale,
    scaleY: aScaleY * scale,
  };
};
