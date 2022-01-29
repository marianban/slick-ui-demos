varying vec3 vBoardBgColor;
varying vec2 vUv;
varying float vRows;
varying float vCols;
varying float vPlayhead;
varying float vPx;
varying float vPy;
varying float vPw;
varying float vTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float border(float start, float end, float v) {
  return clamp(smoothstep(start, end, v) - smoothstep(end, start, v), 0., 1.) * 2.;
}

float grid(vec2 uv, float lw) {
  float top = border(1. - lw, 1., uv.y);
  float bottom = 1. - border(0., lw, uv.y);
  float left = border(1. - lw, 1., uv.x);
  float right = 1. - border(0., lw, uv.x);
  float b = max(max(max(left, right), top), bottom);
  return b;
}

void main()
{
  vec2 nUv = fract(vUv * vec2(vCols + 1., vRows + 1.));
  float boxWidth = 1. / (vCols + 1.);

  float outerBorder = grid(nUv, 0.05);
  float innerBorder = grid(nUv, 0.1);

  float p = 1. - vPy/vRows;
  float duration = 2.;

  float play = mod(vTime, duration) / duration;
  float playhead = p + ((1. - p) * play);

  float strength = 0.2;
  float pY = clamp(1. - vUv.y, 0. ,1.);

  float above = smoothstep(playhead - strength, playhead, pY);
  float below = clamp(1. - smoothstep(playhead, playhead + strength, pY), 0., 1.);

  float c = 0.27;
  vec3 bgColor = vec3(c);
  vec3 lineColor = vec3(c);

  vec3 effectColor = vec3(0.9);
  vec3 effect = effectColor * min(above, below);
  effect *= effect;
  effect *= effect;
  effect *= .7 * (innerBorder - outerBorder);
  float lpx = vPx - 1.;
  float l = smoothstep(lpx * boxWidth, (lpx + 1.) * boxWidth, vUv.x);
  float rpx = vPx + 1.;
  float r = smoothstep((rpx + vPw) * boxWidth, (rpx + vPw - 1.) * boxWidth, vUv.x);
  effect *= min(l, r);

  lineColor = lineColor * outerBorder;

  vec3 color = max(vec3(bgColor - lineColor), effect);

  // color = vec3(min(l, r));

  gl_FragColor = vec4(color, 1.0);
}
