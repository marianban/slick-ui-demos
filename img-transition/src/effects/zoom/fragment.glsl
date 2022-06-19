varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform float uProgressMix;
uniform vec2 uScreenSize;
uniform float uAspectRatio;

void main()
{
    float dist = length((vUv - 0.5));
    vec2 nUv = (((vUv - 0.5) / (1. + (uProgressMix * 15.))) + 0.5);
    vec2 nUv2 = (((vUv - 0.5) * (1. + ((1. - uProgressMix) * 30.))) + 0.5);

    vec4 color1 = texture(uTexture1, nUv);
    vec4 color2 = texture(uTexture2, nUv2);





    // float s = smoothstep(dist - dist * 0.2, dist, uProgressMix);
    // vec4 color = mix(color1, color2, clamp(s, 0., 1.));
    vec4 color = mix(color1, color2, smoothstep(0.5, 1., uProgressMix));
    gl_FragColor = color;
}
