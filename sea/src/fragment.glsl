varying float vNoise;
varying vec3 vNormal;

void main()
{
    gl_FragColor = vec4(vNoise, 0., 0.0, 1.0);
    gl_FragColor = vec4(vNormal, 1.0);
}
