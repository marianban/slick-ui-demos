varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform float uProgressMix;
uniform vec2 uScreenSize;
uniform float uAspectRatio;

void main()
{
    vec2 nUv = vUv;
    // vec2 nUv = vUv * vec2(uAspectRatio, 1.);

    vec4 color1 = texture(uTexture1, nUv);
    vec4 color2 = texture(uTexture2, nUv);
    float dist = distance(color1, color2);
    float s = step(dist/2., uProgressMix);
    vec4 color = mix(color1, color2, clamp(s, 0., 1.));
    gl_FragColor = color;
}
