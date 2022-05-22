uniform float uProgress;
uniform float uPixelRatio;
uniform float uAspectRatio;
uniform float uPixelSize;
uniform float uProgressMix;

varying vec2 vUv;

void main()
{
    vUv = uv;

    vec3 pos = position;

    pos.z += (uProgress * 30.);

    gl_PointSize = uPixelRatio * uPixelSize;

    vec4 mPosition = modelMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}
