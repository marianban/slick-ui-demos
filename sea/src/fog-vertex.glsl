attribute float aScale;
attribute float aRand;

uniform float uSize;
uniform float uTime;

varying float uRand;

void main()
{
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    uRand = aRand;

    /**
     * Size
     */
    gl_PointSize = uSize * (aScale + sin(aRand + uTime * 0.3) * 0.3);
}
