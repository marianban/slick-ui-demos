varying vec2 vUv;

uniform float uProgress;

#define PI 3.1415926538

float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

uniform float uPixelRatio;
uniform float uAspectRatio;
uniform float uPixelSize;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main()
{
    vUv = uv;

    vec3 pos = position;

    pos = rotate(pos, vec3(0.,0.,1.), step(0.1, uProgress) * (uProgress - 0.1) * PI * 2.);

    float angle = PI * 2. * hash(vUv * 100.);

    vec2 dir = vec2(cos(angle), sin(angle));

    float hValue = hash(vUv * 200.);
    pos.xy += dir * mix(0., 1500. + (10000. * hValue), uProgress / clamp(hValue, 0.3, 0.9) * 0.06 );

    gl_PointSize = uPixelRatio * uPixelSize;

    vec4 mPosition = modelMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}
