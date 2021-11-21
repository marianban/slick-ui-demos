uniform float uTime;
uniform float uNoiseStrength;
uniform float uNoiseFrequency;
uniform float uNoiseScale;

uniform float uWaveXStrength;
uniform float uWaveXFrequency;
uniform float uWaveYStrength;
uniform float uWaveYFrequency;

varying float vNoise;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vViewDir;
varying float vDepth;


varying vec3 normalInterp;
varying vec3 vertPos;


attribute vec3 aPrevPosition;
attribute vec3 aNextPosition;


// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelPrevPosition = modelMatrix * vec4(aPrevPosition, 1.0);
    vec4 modelNextPosition = modelMatrix * vec4(aNextPosition, 1.0);

    float noise = snoise(modelPosition.xz * uNoiseScale + uTime * uNoiseFrequency) * uNoiseStrength;
    vNoise = noise;
    float noisePrev = snoise(modelPrevPosition.xz * uNoiseScale + uTime * uNoiseFrequency) * uNoiseStrength;
    float noiseNext = snoise(modelNextPosition.xz * uNoiseScale + uTime * uNoiseFrequency) * uNoiseStrength;

    float wave = sin(position.x * uWaveXFrequency + uTime)*uWaveXStrength;
    wave += sin(position.y * uWaveYFrequency + uTime)*uWaveYStrength;

    modelPosition.y += wave + noise;
    modelPrevPosition.y += wave + noisePrev;
    modelNextPosition.y += wave + noiseNext;

    float maxDepth = uNoiseStrength + uWaveXStrength + uWaveYStrength;
    vDepth = (wave + noise)/maxDepth;

    vec3 a = modelPrevPosition.xyz;
    vec3 b = modelPosition.xyz;
    vec3 c = modelNextPosition.xyz;

    vec3 ab = a - b;
    vec3 cb = c - b;

    vec3 n = abs(normalize(cross(cb, ab)));

    vNormal = n * normalMatrix;
    normalInterp = vNormal;

    vec4 lightPosition = viewMatrix * vec4(0., 0., 10., 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vViewDir = normalize(vec3(0,0,0) - viewPosition.xyz);

    vLightDir = normalize(lightPosition.xyz - viewPosition.xyz);

    vertPos = vec3(viewPosition) / viewPosition.w;

    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}
