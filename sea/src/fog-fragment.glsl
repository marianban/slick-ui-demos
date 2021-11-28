uniform sampler2D uTexture;
uniform float uTime;
varying vec4 vPos;
varying float uRand;

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main()
{
    vec2 pt = gl_PointCoord;
    pt -= vec2(0.5);
    pt = rotate2d(sin(uRand + uTime * 0.05)*PI) * pt;
    pt += vec2(0.5);
    vec2 uv = vec2(pt.x, 1.0 - pt.y);
    vec4 textureColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 textureAlpha = texture2D(uTexture, uv);
    textureColor.w = textureAlpha.x * 0.1;
    gl_FragColor = textureColor;
}
