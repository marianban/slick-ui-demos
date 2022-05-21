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

  // if (textureAspectRatio > 1) {
  //   scaleX = textureAspectRatio;
  // } else if (textureAspectRatio < 1) {
  //   scaleY = 1 / textureAspectRatio;
  // }

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

  console.log({
    aScaleX,
    aScaleY,
    textureWidth,
    textureHeight,
    initialTextureWidth,
    initialTextureHeight,
    windowWidth,
    windowHeight,
  });

  // let vmin = Math.min(windowWidth, windowHeight);
  // let scaleX2 = Math.min(vmin / textureWidth, 1);
  // let scaleY2 = Math.min(vmin / textureHeight, 1);
  // let scale2 = Math.min(scaleX2, scaleY2);

  // scaleX2 = windowWidth / textureWidth;
  // scaleY2 = scaleX2;

  // // let vmin = Math.min(windowWidth, windowHeight);
  // let scaleX = Math.min(textureWidth / windowWidth, 1);
  // let scaleY = Math.min(windowHeight / textureHeight, 1);
  // console.log(scaleX, scaleY);
  // let scale = Math.min(scaleX, scaleY);

  // console.log(scale);

  // // console.log({
  // //   vmin,
  // // });

  // console.log({ aScaleX, scaleY, scaleX2, scaleY2 });

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
