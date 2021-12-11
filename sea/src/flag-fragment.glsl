uniform sampler2D uTexture;
uniform vec4 vPos;
uniform vec3 uDarkColor;

varying vec2 vUv;
varying float vDisplacementStrength;

void main()
{
    vec4 color = texture2D(uTexture, vUv);
    color += vDisplacementStrength * 0.12;
    color.rgb *= 0.55;
    gl_FragColor = color;
}
