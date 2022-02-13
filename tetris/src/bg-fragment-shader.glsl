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
  vec4 color = vec4(vColor, 1.0);

  vec2 nUv = (vUv - 0.5) * 2.;
  float d = length(vec2(nUv));
  float vignete = smoothstep(0.9, 2., d);

  // https://www.anisopteragames.com/how-to-fix-color-banding-with-dithering/
  vec4 dither = vec4(texture2D(uBayerTexture,  gl_FragCoord.xy / 8.0).r / 32.0 - (1.0 / 128.0));
  color += dither;
  color -= vignete * 0.2;

  gl_FragColor = color;
}
