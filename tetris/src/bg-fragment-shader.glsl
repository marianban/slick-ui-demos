varying vec3 vBoardBgColor;
varying vec3 vBoardBgColorDark;
varying vec2 vUv;
varying float vTime;
varying vec3 vColor;

uniform sampler2D uBayerTexture;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
  // vec2 nUv = (vUv - 0.5) * 2.;

  // float c = length(vUv - vec2(0.5, vUv.y));


  // vec3 color = vBoardBgColor;
  // color = vec3(c*c);

  // float d = length(vec2(0.) - nUv);

  // color = vec3(d);

  // color = mix(vBoardBgColorDark, vBoardBgColor, d);

  vec4 color = vec4(vColor, 1.0);

  vec4 dither = vec4(texture2D(uBayerTexture, vUv / 24.0).r / 32.0 - (1.0 / 128.0));
  color += dither;

  // color.r = (floor(color*63. + 0.5)/63.).r;

  gl_FragColor = color;
}
