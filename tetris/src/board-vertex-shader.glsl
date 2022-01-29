uniform vec3 uBoardBgColor;
uniform float uRows;
uniform float uCols;

varying vec3 vBoardBgColor;
varying vec2 vUv;
varying float vRows;
varying float vCols;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vBoardBgColor = uBoardBgColor;
  vUv = uv;
  vRows = uRows;
  vCols = uCols;

  gl_Position = projectedPosition;
}
