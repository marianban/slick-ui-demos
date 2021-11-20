uniform float uPixelRatio;
uniform float uProgress;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  float progress = uProgress * uProgress;
  gl_PointSize = 150.0 * uPixelRatio * ((1.0 - progress));
}
