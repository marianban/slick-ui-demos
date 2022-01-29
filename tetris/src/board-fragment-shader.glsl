varying vec3 vBoardBgColor;
varying vec2 vUv;
varying float vRows;
varying float vCols;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
  // horizontal lines
  float rowWidth = 1.0 / (vRows + 1.);
  float lineWidth = mod(vUv.y , rowWidth );
  float lineHorizontal = smoothstep(rowWidth  * 0.95, rowWidth , lineWidth);

  float colWidth = 1.0 / (vCols + 1.);
  float lineColWidth = mod(vUv.x , colWidth );
  float lineVertical = smoothstep(colWidth  * 0.95, colWidth , lineColWidth);

  float row = floor(vRows * random(vec2(1.)));
  float col = floor(vCols * random(vec2(1.)));

  float rowStart = rowWidth * row;
  float rowEnd = rowWidth * (row + 1.);
  float sy = step(rowStart, vUv.y) - step(rowEnd, vUv.y);

  float colStart = colWidth * col;
  float colEnd = colWidth * (col + 1.);
  float sx = step(colStart, vUv.x) - step(colEnd, vUv.x);



  vec3 lineColor = vec3(0.1);

  vec3 finalColor = mix(vBoardBgColor, lineColor, max(lineVertical,  lineHorizontal));

  gl_FragColor = vec4(vec3(finalColor + 0.05 * sx * sy), 1.0);
}
