uniform vec3 uBoardBgColor;
uniform float uRows;
uniform float uCols;
uniform float uPlayhead;
uniform float uPx;
uniform float uPy;
uniform float uPw;
uniform float uTime;

varying vec3 vBoardBgColor;
varying vec2 vUv;
varying float vRows;
varying float vCols;
varying float vPlayhead;
varying float vPx;
varying float vPy;
varying float vPw;
varying float vTime;


void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vBoardBgColor = uBoardBgColor;
  vUv = uv;
  vRows = uRows;
  vCols = uCols;
  vPlayhead = uPlayhead;
  vPx = uPx;
  vPy = uPy;
  vPw = uPw;
  vTime = uTime;

  gl_Position = projectedPosition;
}
