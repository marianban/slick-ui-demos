varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;

void main()
{
    vec2 nUv = gl_FragCoord.xy / vec2(400, 400);

    vec4 color1 = texture(uTexture1, vUv);
    vec4 color2 = texture(uTexture2, vUv);
    vec4 color = mix(color1, color2, step(uProgress, vUv.x));
    gl_FragColor = color;
}
