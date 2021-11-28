// #include <encodings_pars_fragment>

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

float near = 0.1;


float far  = 15.0;

float LinearizeDepth(float depth)
{
    float z = depth * 2.0 - 1.0; // back to NDC
    return (2.0 * near * far) / (far + near - z * (far - near));
}


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

    float depth = LinearizeDepth(gl_FragCoord.z) / far;

    // colorLinear = vec3(depth);

    gl_FragColor = vec4(colorLinear * 1.0, 1.0 - depth - 0.1);

    #include <tonemapping_fragment>
    #include <encodings_fragment>
}
