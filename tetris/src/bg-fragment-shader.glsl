varying vec3 vBoardBgColor;
varying vec3 vBoardBgColorDark;
varying vec2 vUv;
varying float vTime;
varying vec3 vColor;

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

  vec3 color = vColor;

  gl_FragColor = vec4(color, 1.0);
}
