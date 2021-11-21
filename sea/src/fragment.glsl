varying float vNoise;
varying vec3 vNormal;

varying vec3 normalInterp;
varying vec3 vertPos;
varying float vDepth;

uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform float uLightPower;
uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uDiffuseDarkColor;
uniform vec3 uSpecColor;
uniform float uShininess;
uniform float uScreenGamma;

void main()
{

    vec3 normal = normalize(normalInterp);
    vec3 lightDir = uLightPos - vertPos;
    float distance = length(lightDir);
    distance = distance * distance;
    lightDir = normalize(lightDir);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;

    if (lambertian > 0.0) {
        vec3 viewDir = normalize(-vertPos);

        // this is blinn phong
        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        specular = pow(specAngle, uShininess);
    }

    vec3 diffuseColor = mix(uDiffuseDarkColor,uDiffuseColor, vDepth);

    vec3 colorLinear = uAmbientColor +
                     diffuseColor * lambertian * uLightColor * uLightPower / distance +
                     uSpecColor * specular * uLightColor * uLightPower / distance;

    // apply gamma correction (assume ambientColor, diffuseColor and specColor
    // have been linearized, i.e. have no gamma correction in them)
    vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0 / uScreenGamma));

    gl_FragColor = vec4(colorGammaCorrected, 1.0);

    #include <tonemapping_fragment>
    #include <encodings_fragment>
}
