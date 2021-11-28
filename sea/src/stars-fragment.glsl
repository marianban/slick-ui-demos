uniform sampler2D uTexture;
uniform float uTime;

void main()
{
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 textureColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 textureAlpha = texture2D(uTexture, uv);
    float shimering = step(0.05, mod(uTime * 4., 0.1 + gl_PointCoord.y));
    textureColor.w = textureAlpha.x * shimering;
    gl_FragColor = textureColor;
}
