uniform sampler2D uTexture;
uniform float uTime;
uniform float uProgress;

void main() {
  vec2 uv = (vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

  // texture rotation https://www.shadertoy.com/view/tsSXzt

  float angle = uTime;
  float s = sin(angle);
  float c = cos(angle);
  mat2 rotationMatrix = mat2(c, s, -s, c);
  vec2 pivot = vec2(0.5, 0.5);
  uv = rotationMatrix * (uv - pivot) + pivot;

  vec4 textureColor = texture2D(uTexture, uv);

  vec4 transparent = vec4(textureColor.rgb, min(textureColor.a, uProgress));

  gl_FragColor = transparent;
}
