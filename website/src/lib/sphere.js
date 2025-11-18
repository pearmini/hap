import {
  contextGL2,
  setUniform,
  drawMesh,
  M,
  createTexture,
  vertexMap,
  updateTextureFromFBO,
  addTexture,
  useMouse,
} from "./helper";
import * as d3 from "d3";

function createMesh(nu, nv, p) {
  let mesh = [];
  for (let j = nv; j > 0; j--) {
    for (let i = 0; i <= nu; i++) mesh.push(p(i / nu, j / nv), p(i / nu, j / nv - 1 / nv));
    mesh.push(p(1, j / nv - 1 / nv), p(0, j / nv - 1 / nv));
  }
  return mesh.flat();
}

function sphereMesh(nu, nv) {
  return createMesh(nu, nv, (u, v) => {
    let theta = Math.PI * 2 * u,
      phi = Math.PI * (v - 0.5),
      x = Math.cos(phi) * Math.cos(theta),
      y = Math.cos(phi) * Math.sin(theta),
      z = Math.sin(phi);
    return [x, y, z, x, y, z, -y, x, 0, u, v]; // INCLUDE DIRECTION OF TANGENT TO SURFACE
  });
}

function drawObj(gl, mesh, matrix, vertexSize, bumps, color) {
  let m = M.mxm(M.perspective(0, 0, -0.5), matrix);
  setUniform(gl, "Matrix4fv", "uMF", false, m);
  setUniform(gl, "Matrix4fv", "uMI", false, M.inverse(m));
  setUniform(gl, "3fv", "uColor", color ?? [1, 1, 1]);
  drawMesh(gl, mesh, vertexSize);
}

export function sphere({parent, width, height, bumps, filterFBO}) {
  let gl;
  let mesh;
  let timer;
  let sphereTexture;
  let spinX;
  let spinY;
  let mouse;
  let isDragging = false;

  const _ = {};

  const vertexShader = `#version 300 es
    uniform mat4 uMF, uMI;

    in  vec3 aPos, aNor, aTan;
    in  vec2 aUV;

    out vec3 vPos, vNor, vTan;
    out vec2 vUV;

    void main() {
        vec4 pos = uMF * vec4(aPos, 1.);
        vec4 nor = vec4(aNor, 0.) * uMI;
        vec4 tan = vec4(aTan, 0.) * uMI;
        gl_Position = pos * vec4(1.,1.,-.1,1.);
        vPos = pos.xyz;
        vNor = nor.xyz;
        vTan = tan.xyz; // NEED TANGENT VECTOR!
        vUV  = aUV;
    }
 `;

  const fragmentShader = `#version 300 es
      precision highp float;
      in  vec3 vPos, vNor, vTan;
      in  vec2 vUV;
      out vec4 fragColor;
      uniform vec3 uColor;
      uniform sampler2D uSampler[2];

      void main() {
        vec3 nor = normalize(vNor);
        vec3 tan = normalize(vTan);

        vec4 B = texture(uSampler[1], vUV);
        vec3 bin = normalize(cross(nor,tan));
        nor = normalize(nor
	              + (2.*B.r-1.) * tan
	              + (2.*B.g-1.) * bin);

        float c = .1 + max(0., dot(vec3( .5),nor))
                    + max(0., dot(vec3(-.5),nor));

        vec3 L = vec3(.577);
	      vec3 Key  = vec3(.5,.7,1.),
	      Fill = vec3(.6,.2,.1);
        float d = dot(L,nor), r = 2.*d*nor.z - L.z;
        vec3 diffuse = .2 + .5 * Key  * max(0., d)
	                   + .5 * Fill * max(0.,-d);
        vec3 specular = Key  * pow(max(0., r),20.)
	               + Fill * pow(max(0.,-r),20.);

	      vec3 color = uColor * diffuse + specular;

        vec4 T = texture(uSampler[0], vUV);

        fragColor = vec4(sqrt(color) * T.rgb, 1.);
      }
   `;

  function update() {
    // Update texture from filter FBO.
    const fbw = filterFBO.fboWidth || width;
    const fbh = filterFBO.fboHeight || height;
    updateTextureFromFBO(filterFBO.gl, filterFBO.fbo, gl, sphereTexture, fbw, fbh);

    // Draw mesh.
    setUniform(gl, "1iv", "uSampler", [0, 1]);
    const vertexSize = vertexMap(gl, ["aPos", 3, "aNor", 3, "aTan", 3, "aUV", 2]);
    if (!isDragging) {
      spinX += 1 / 100;
      spinY += 1 / 100;
    }
    const matrix = M.mxm(M.turnY(spinX), M.mxm(M.turnX(spinY), M.scale(0.7)));
    drawObj(gl, mesh, matrix, vertexSize, [1, 1, 1]);
  }

  _.start = function () {
    spinX = 0;
    spinY = 0;
    isDragging = false;
    mesh = {triangle_strip: true, data: new Float32Array(sphereMesh(40, 20))};
    gl = contextGL2({parent, width, height, vertexShader, fragmentShader});

    let delay;
    mouse = useMouse(gl, {
      drag: (dx, dy) => {
        spinX += dx;
        spinY += dy;
      },
      down: () => {
        isDragging = true;
        if (delay) clearTimeout(delay);
      },
      up: () => {
        if (delay) clearTimeout(delay);
        delay = setTimeout(() => {
          isDragging = false;
        }, 2000);
      },
    });

    sphereTexture = createTexture(gl, 0);

    if (bumps) {
      addTexture(gl, 1, bumps);
    } else {
      // Create a default flat texture (no bumps) - 1x1 gray image (0.5, 0.5, 0.5) for no bump effect
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#808080"; // Gray (0.5, 0.5, 0.5) for no bump effect
      ctx.fillRect(0, 0, 1, 1);
      const defaultBumps = new Image();
      defaultBumps.src = canvas.toDataURL();
      // Wait for image to load before adding texture
      defaultBumps.onload = () => {
        addTexture(gl, 1, defaultBumps);
      };
    }
    timer = d3.interval(update, 10);
  };

  _.destroy = function () {
    timer?.stop();
    timer = null;
    mouse?.destroy();
    mouse = null;
  };

  return _;
}
