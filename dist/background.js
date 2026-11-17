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

        // Subtle upward flame teardrop taper as blobs ignite, while staying distinct blobs
        diff.x *= mix(1.0, 1.38, t);
        diff.y *= mix(1.0, 0.72, t);

        float baseRadius = 0.165 + 0.045 * sin(phase * 3.1 + time * 0.35);
        // Reduce blob size as it transitions into fire so individual fire blobs are clearly separated and visible
        float radius = baseRadius * mix(1.0, 0.72, t);
        // Crisp, tight kernel for sleek, well-defined sculptural blobs
        float distSq = dot(diff, diff) + 0.0022;
        field += (radius * radius) / distSq;
    }
    return field;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float t = clamp(uTransition, 0.0, 1.0);

    // Aspect-corrected centered coordinates for smooth metaballs
    vec2 centered = (fragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

    // 1. Zero-noise defined metaball field (Zen = 0.0)
    float blobField = computeMetaballField(centered, iTime, t);

    // 2. User's exact fire coordinates & procedural noise
    float gradientStep = 0.2;

    vec2 pos = fragCoord.xy / iResolution.x;
    pos.x += 0.08 * sin(pos.y * 5.0 + iTime * 1.8);
    pos.y -= iTime * 0.7;

    float noiseTexel = t > 0.0 ? max(0.02, pnoise(pos, 10.0, 5, 0.5)) : 0.5;

    // 3. THE DEFINED BLOBS THEMSELVES BECOME FIRE BLOBS (Zero overlay):
    // At t = 0: pure, razor-clean noise-free liquid-satin blobs.
    // As t -> 1: pnoise turbulence licks outward from the blob edges and dances inside them,
    // turning each blob into a blazing fire blob while preserving their distinct floating forms.
    float turb = smoothstep(0.0, 1.0, t);

    // Normalize the blob field into a clean 0..1+ elevation profile (0.72 is the crisp outer boundary)
    float cleanBlobProfile = clamp((blobField - 0.52) / 0.58, 0.0, 1.35);

    // Perturb the blob boundary with your pnoise so flames lick upward off each blob
    float fireTurbulence = (noiseTexel - 0.38) * 1.15 * turb;
    float blobElevation = max(0.0, cleanBlobProfile + fireTurbulence * smoothstep(0.0, 0.35, blobField));

    // 4. Reference Palette -> Exact Fire Colors
    vec3 colIndigo    = vec3(0.055, 0.075, 0.286); // #0e1349
    vec3 colTwilight  = vec3(0.141, 0.063, 0.275); // #241046
    vec3 colRoyal     = vec3(0.204, 0.063, 0.314); // #341050
    vec3 colPlum      = vec3(0.286, 0.043, 0.216); // #490b37
    vec3 colVelour    = vec3(0.490, 0.115, 0.440); // Deep satin violet-magenta
    vec3 colSilkSheen = vec3(0.680, 0.250, 0.650); // Luminous silk highlight

    // Deep midnight-indigo to plum backdrop transitions smoothly into a warm crimson-magenta ember glow (never black)
    vec3 zenBgBase = mix(
        mix(colIndigo * 0.78, colTwilight * 0.88, smoothstep(0.0, 0.52, uv.y)),
        colPlum * 0.88,
        smoothstep(0.45, 1.0, uv.y)
    );
    vec3 fireBgEmber = mix(
        vec3(0.28, 0.02, 0.12), // Deep crimson-berry base
        vec3(0.48, 0.05, 0.22), // Rich rose-pink upper glow
        smoothstep(0.0, 1.0, uv.y)
    );
    vec3 zenBgGrad = mix(zenBgBase, fireBgEmber, smoothstep(0.0, 1.0, t));

    // Smooth, sculpted satin shading inside each defined Zen blob (zero hard bands at t = 0)
    float innerDepth = smoothstep(0.72, 1.45, blobField);
    float rimHighlight = smoothstep(0.72, 0.78, blobField) * (1.0 - smoothstep(0.78, 0.96, blobField));
    vec3 zenBlobSatin = mix(
        mix(colRoyal, colPlum, smoothstep(0.15, 0.85, uv.y)),
        colVelour,
        innerDepth * 0.85
    );
    zenBlobSatin = mix(zenBlobSatin, colSilkSheen, rimHighlight * 0.48 + pow(innerDepth, 1.6) * 0.42);

    // Crisp anti-aliased silhouette for the defined Zen blobs
    float zenMask = smoothstep(0.70, 0.745, blobField);

    // Deep Crimson Red, Scarlet, and Hot Pink fire palette (zero yellow, no black)
    vec4 fireBright = vec4(1.0, 0.14, 0.12, 1.0);  // Blazing Scarlet-Red core (no yellow)
    vec4 fireMid    = vec4(0.95, 0.05, 0.36, 1.0); // Vibrant Crimson-Pink middle layer
    vec4 fireDark   = vec4(0.72, 0.01, 0.14, 1.0); // Deep Blood-Red outer flame

    float firstStep       = smoothstep(0.0, noiseTexel, blobElevation);
    float darkerColorStep = smoothstep(0.0, noiseTexel, blobElevation - gradientStep);
    float darkerColorPath = firstStep - darkerColorStep;
    vec4 fireBlobColor    = mix(fireBright, fireDark, darkerColorPath);

    float middleColorStep = smoothstep(0.0, noiseTexel, blobElevation - 0.2 * 2.0);
    fireBlobColor         = mix(fireBlobColor, fireMid, darkerColorStep - middleColorStep);
    fireBlobColor         = mix(vec4(fireBgEmber, 1.0), fireBlobColor, firstStep);

    // Unified morph of the blobs themselves: defined satin Zen blobs -> roaring stepped fire blobs
    float activeMask = mix(zenMask, firstStep, turb);
    vec3 activeBlobRgb = mix(zenBlobSatin, fireBlobColor.rgb, turb);

    vec3 finalRgb = mix(zenBgGrad, activeBlobRgb, activeMask);
    fragColor = vec4(finalRgb, 1.0);
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
