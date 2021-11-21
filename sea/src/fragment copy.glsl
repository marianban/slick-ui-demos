varying float vNoise;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vViewDir;


void main()
{



    float ambientStrength = 0.1;
    float light = max(ambientStrength, dot(normalize(vNormal), normalize(vLightDir)));
    vec3 r = reflect(-normalize(vLightDir), normalize(vNormal));
    r = normalize(vLightDir + vViewDir);
    float sl = dot(vLightDir, r);
    float specularLight = clamp(sl, 0., 1.);
    float glossiness = pow(specularLight, 20.);
    vec3 glossColor = vec3(0.9, 0.9, 0.9) * glossiness;


    vec3 color = vec3(0, 96/255,255/255);



    gl_FragColor = vec4(color * light + glossColor, 1.0);
}
