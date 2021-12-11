uniform float uTime;


varying vec2 vUv;
varying vec4 vPos;
varying float vDisplacementStrength;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float maxDisplacement = 0.015;
    float flagDisplacement = sin((position.x * 15. + uTime) * 5.) * maxDisplacement;


    flagDisplacement += sin((position.y * 15. + uTime) * 3.) * maxDisplacement * 0.5;

    vDisplacementStrength = flagDisplacement / maxDisplacement;

    modelPosition.x += flagDisplacement;
    modelPosition.y += sin((position.x * 15. + uTime) * 5.) * 0.0015;
    vPos = modelPosition;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}
