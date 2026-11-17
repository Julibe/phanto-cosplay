'use strict';

const vertexSource = `
attribute vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;
const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform float uTransition; // 0.0 = Zen Multiple Blobs (zero noise), 1.0 = Evil Fire (exact pnoise)
uniform float uBlobCount;  // Number of floating Zen metaball blobs

// --- User's Exact Noise Functions ---
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float hermite(float t) {
    return t * t * (3.0 - 2.0 * t);
}

float noise(vec2 co, float frequency) {
    vec2 v = vec2(co.x * frequency, co.y * frequency);

    float ix1 = floor(v.x);
    float iy1 = floor(v.y);
    float ix2 = floor(v.x + 1.0);
    float iy2 = floor(v.y + 1.0);

    float fx = hermite(fract(v.x));
    float fy = hermite(fract(v.y));

    float fade1 = mix(rand(vec2(ix1, iy1)), rand(vec2(ix2, iy1)), fx);
    float fade2 = mix(rand(vec2(ix1, iy2)), rand(vec2(ix2, iy2)), fx);

    return mix(fade1, fade2, fy);
}

float pnoise(vec2 co, float freq, int steps, float persistence) {
    float value = 0.0;
    float ampl = 1.0;
    float sum = 0.0;
    for (int i = 0; i < 5; i++) {
        if (i >= steps) break;
        sum += ampl;
        value += noise(co, freq) * ampl;
        freq *= 2.0;
        ampl *= persistence;
    }
    return value / sum;
}

// Pure noise-free analytical metaball field for Zen floating blobs
float computeMetaballField(vec2 p, float time, float t) {
    float field = 0.0;
    float hottest = 0.0;
    float count = clamp(uBlobCount, 1.0, 10.0);

    for (int i = 0; i < 10; i++) {
        float fi = float(i);
        if (fi >= count) break;

        float phase = fi * 1.6180339;
        // Continuous, smooth harmonic motion with zero periodic wrap jumps or slider phase leaps
        float baseX = sin(time * 0.24 + phase * 2.1) * 0.42 + cos(time * 0.14 - phase) * 0.16;
        float baseY = cos(time * 0.19 + phase * 1.7) * 0.34 + sin(time * 0.11 + phase * 2.9) * 0.12;

        vec2 center = vec2(baseX, baseY);
        vec2 diff = p - center;

        // Narrow the upper half and bend the tip as the flame rises.
        float tip = clamp(diff.y * 4.0, 0.0, 1.0);
        diff.x -= t * tip * tip * 0.085 * sin(time * 2.1 + phase);
        diff.x *= mix(1.0, 1.12 + tip * 1.55, t);
        diff.y *= mix(1.0, mix(0.88, 0.42, tip), t);

        float baseRadius = 0.165 + 0.045 * sin(phase * 3.1 + time * 0.35);
        // Reduce blob size as it transitions into fire so individual fire blobs are clearly separated and visible
        float radius = baseRadius * mix(1.0, 0.72, t);
        // Crisp, tight kernel for sleek, well-defined sculptural blobs
        float distSq = dot(diff, diff) + 0.0022;
        float strength = (radius * radius) / distSq;
        field += strength;
        hottest = max(hottest, strength);
    }
    return mix(field, hottest, t);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    float t = clamp(uTransition, 0.0, 1.0);
    float turb = smoothstep(0.0, 1.0, t);
    float shortEdge = min(iResolution.x, iResolution.y);
    vec2 centered = (fragCoord - 0.5 * iResolution) / shortEdge;
    float blobField = computeMetaballField(centered, iTime, t);

    // Violet dominates the backdrop and blobs, with blue and pink drifting across both.
    vec3 deepViolet = vec3(0.19, 0.067, 0.34);
    vec3 plum = vec3(0.36, 0.085, 0.49);
    vec3 blue = vec3(0.035, 0.30, 0.86);
    vec3 pink = vec3(0.89, 0.13, 0.53);
    vec2 blueDelta = uv - vec2(0.22 + 0.10 * sin(iTime * 0.16), 0.63);
    vec2 pinkDelta = uv - vec2(0.78, 0.35 + 0.11 * cos(iTime * 0.19));
    float blueGlow = exp(-6.0 * dot(blueDelta, blueDelta));
    float pinkGlow = exp(-7.5 * dot(pinkDelta, pinkDelta));
    vec3 zenBackdrop = mix(deepViolet, plum, smoothstep(0.10, 0.90, uv.y));
    zenBackdrop = mix(zenBackdrop, blue, blueGlow * 0.32);
    zenBackdrop = mix(zenBackdrop, pink, pinkGlow * 0.23);

    float innerDepth = smoothstep(0.72, 1.45, blobField);
    float rim = smoothstep(0.72, 0.78, blobField) * (1.0 - smoothstep(0.78, 0.96, blobField));
    float pinkContour = smoothstep(-0.35, 0.44, centered.x + 0.15 * sin(iTime * 0.21));
    vec3 zenTint = mix(blue, pink, pinkContour);
    vec3 zenBlob = mix(vec3(0.50, 0.18, 0.72), zenTint, 0.18 + innerDepth * 0.29);
    zenBlob = mix(zenBlob, vec3(0.82, 0.57, 0.95), rim * 0.56);
    vec3 zen = mix(zenBackdrop, zenBlob, smoothstep(0.70, 0.745, blobField));

    if (t <= 0.0) {
        fragColor = vec4(zen, 1.0);
        return;
    }

    // Berry's noise flows upward, shaping scarlet edges, pink ridges, and orange cores.
    vec2 firePosition = fragCoord / shortEdge;
    firePosition.x += 0.08 * sin(firePosition.y * 5.0 + iTime * 1.8);
    firePosition.y -= iTime * 0.7;
    float noiseTexel = max(0.02, pnoise(firePosition, 10.0, 5, 0.5));
    float turbulence = (noiseTexel - 0.50) * 0.50;
    float flameField = blobField + turbulence * smoothstep(0.14, 0.65, blobField);
    float flame = smoothstep(0.48, 0.68, flameField);
    float heat = clamp((flameField - 0.52) / 0.9, 0.0, 1.35);
    float hotBand = smoothstep(0.11, 0.64, heat);
    float pinkBand = smoothstep(0.22, 0.48, heat) * (1.0 - smoothstep(0.6, 0.92, heat));
    float orangeCore = smoothstep(0.68, 1.30, heat + (noiseTexel - 0.48) * 0.26);
    vec3 fireBlob = mix(vec3(0.66, 0.027, 0.111), vec3(1.0, 0.13, 0.12), hotBand);
    fireBlob = mix(fireBlob, vec3(1.0, 0.18, 0.49), pinkBand * 0.73);
    fireBlob = mix(fireBlob, vec3(1.0, 0.48, 0.13), orangeCore * 0.84);

    vec3 emberBackdrop = mix(vec3(0.34, 0.049, 0.069), vec3(0.53, 0.064, 0.282), uv.y);
    vec2 emberDelta = uv - vec2(0.47, 0.16);
    float emberGlow = exp(-7.0 * dot(emberDelta, emberDelta));
    emberBackdrop = mix(emberBackdrop, vec3(0.79, 0.21, 0.075), emberGlow * 0.4);
    float halo = smoothstep(0.23, 0.68, flameField) * 0.20;
    emberBackdrop = mix(emberBackdrop, vec3(0.90, 0.13, 0.19), halo);
    fragColor = vec4(mix(zen, mix(emberBackdrop, fireBlob, flame), turb), 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

(() => {
  const canvas = document.getElementById('portal-background');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return;
  let program, locations, frame = 0, lastDraw = 0, elapsed = 0;
  const portal = () => Number(document.body.hasAttribute('data-berry-portal'));
  let transition = portal();

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  function initialize() {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return;
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      program = null;
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    locations = Object.fromEntries(['iResolution', 'iTime', 'uTransition', 'uBlobCount']
      .map(key => [key, gl.getUniformLocation(program, key)]));
    wake();
  }

  function resize() {
    const scale = Math.min(.9, Math.sqrt(480000 / (innerWidth * innerHeight)));
    const width = Math.max(1, Math.round(innerWidth * scale));
    const height = Math.max(1, Math.round(innerHeight * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform2f(locations.iResolution, width, height);
  }

  function draw(now) {
    frame = 0;
    if (document.hidden || !program) return;
    if (motion.matches || !lastDraw || now - lastDraw >= 1000 / 30) {
      const dt = lastDraw ? Math.min(.1, (now - lastDraw) / 1000) : .035;
      lastDraw = now;
      if (motion.matches) transition = portal();
      else {
        elapsed += dt;
        transition += (portal() - transition) * (1 - Math.exp(-dt * 5));
      }
      if (Math.abs(transition - portal()) < .002) transition = portal();
      gl.uniform1f(locations.iTime, motion.matches ? 0 : elapsed);
      gl.uniform1f(locations.uTransition, transition);
      gl.uniform1f(locations.uBlobCount, 6);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!document.body.hasAttribute('data-shader-ready')) document.body.setAttribute('data-shader-ready', '');
    }
    if (!motion.matches) frame = requestAnimationFrame(draw);
  }

  function wake() {
    if (!program || document.hidden) return;
    resize();
    if (!frame) frame = requestAnimationFrame(draw);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastDraw = 0;
  }

  window.addEventListener('resize', wake);
  document.addEventListener('portalchange', wake);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else wake();
  });
  motion.addEventListener('change', wake);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    stop();
    program = null;
    document.body.removeAttribute('data-shader-ready');
  });
  canvas.addEventListener('webglcontextrestored', initialize);
  initialize();
})();
