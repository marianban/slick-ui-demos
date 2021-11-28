attribute float aScale;
attribute float aTextureIndex;

uniform float uSize;

varying float vTextureIndex;

void main()
{
    /**
     * Position
     */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vTextureIndex = aTextureIndex;

    /**
     * Size
     */
    gl_PointSize = uSize * aScale;
}
