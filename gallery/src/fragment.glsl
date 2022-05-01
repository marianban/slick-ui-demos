varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform float uProgressMix;
uniform vec2 uScreenSize;

void main()
{
    vec2 nUv = vUv;

    vec4 color1 = texture(uTexture1, nUv);
    vec4 color2 = texture(uTexture2, nUv);
    vec4 color = mix(color1, color2, uProgressMix);
    gl_FragColor = color;
}
