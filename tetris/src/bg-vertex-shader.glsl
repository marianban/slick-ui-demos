attribute vec3 color;

uniform vec3 uBoardBgColor;
uniform vec3 uBoardBgColorDark;
uniform float uTime;

varying vec3 vBoardBgColor;
varying vec3 vBoardBgColorDark;
varying float vTime;
varying vec2 vUv;
varying vec3 vColor;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vUv = uv;
  vColor = color;
  vBoardBgColor = uBoardBgColor;
  vBoardBgColorDark = uBoardBgColorDark;
  vTime = uTime;

  gl_Position = projectedPosition;
}
