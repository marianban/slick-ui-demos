
uniform sampler2D uTexture;
uniform sampler2D uTextures[texturesCount];

uniform float uTime;

varying float vTextureIndex;

void main()
{
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 textureColor = vec4(1.0, 1.0, 1.0, 1.0);
    int textureIndex = int(round(vTextureIndex));
    vec4 textureAlpha = texture2D(uTextures[0], uv);
    if (textureIndex == 1) {
      textureAlpha = texture2D(uTextures[1], uv);
    }
    if (textureIndex == 2) {
      textureAlpha = texture2D(uTextures[2], uv);
    }
    if (textureIndex == 3) {
      textureAlpha = texture2D(uTextures[3], uv);
    }
    // if (textureIndex == 4) {
    //   textureAlpha = texture2D(uTextures[4], uv);
    // }
    float shimering = step(0.05, mod(uTime * 4., 0.1 + gl_PointCoord.y));
    textureColor.w = textureAlpha.x * shimering;
    gl_FragColor = textureColor;
}
