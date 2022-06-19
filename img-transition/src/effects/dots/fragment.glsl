varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform float uProgressMix;
uniform vec2 uScreenSize;
uniform float uAspectRatio;

void main()
{
    vec2 nUv = fract(vUv * 150.);
    float dist = length((vUv - 0.5) * 1.);

    vec4 color1 = texture(uTexture1, vUv);
    vec4 color2 = texture(uTexture2, vUv);
    float dist2 = length((nUv - 0.5) * 1.5);
    float s = smoothstep(dist2 - dist2 * 0.1, dist2, uProgressMix * (1. - dist) * 3.);
    vec4 color = mix(color1, color2, clamp(s, 0., 1.));
    gl_FragColor = color;
    // gl_FragColor = vec4(vec3(dist), 1.);
}
