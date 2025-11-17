import {contextGL2, setUniform, drawMesh, M, createTexture, vertexMap, updateTextureFromFBO} from "./helper";
import * as d3 from "d3";

function createMesh(nu, nv, p) {
  let mesh = [];
  for (let j = nv; j > 0; j--) {
    for (let i = 0; i <= nu; i++) {
      mesh.push(p(i / nu, j / nv), p(i / nu, j / nv - 1 / nv));
    }
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
    return [x, y, z, x, y, z, u, v]; // VERTEX SIZE IS NOW 8, BECAUSE WE ADD U,V
  });
}

function drawObj(gl, mesh, matrix, vertexSize, color) {
  let m = M.mxm(M.perspective(0, 0, -0.5), matrix);
  setUniform(gl, "Matrix4fv", "uMF", false, m);
  setUniform(gl, "Matrix4fv", "uMI", false, M.inverse(m));
  setUniform(gl, "3fv", "uColor", color ?? [1, 1, 1]);
  drawMesh(gl, mesh, vertexSize);
}

export function sphere({parent, width, height, image, texture, filterFBO}) {
  let gl;
  let mesh;
  let timer;
  let sphereTexture;
  let startTime = Date.now() / 1000;

  const _ = {};

  const vertexShader = `#version 300 es
  uniform mat4 uMF, uMI;

  in  vec3 aPos, aNor;
  in  vec2 aUV;          // NEW VERTEX ATTRIBUTE

  out vec3 vPos, vNor;
  out vec2 vUV;          // NEW VARYING ATTRIBUTE

  void main() {
     vec4 pos = uMF * vec4(aPos, 1.);
     vec4 nor = vec4(aNor, 0.) * uMI;
     gl_Position = pos * vec4(1.,1.,-.1,1.);
     vPos = pos.xyz;
     vNor = nor.xyz;
     vUV  = aUV;
  }
`;

  const fragmentShader = `#version 300 es
    precision highp float;
    in  vec3 vPos, vNor;
    in  vec2 vUV;
    out vec4 fragColor;
    uniform vec3 uColor;
    uniform sampler2D uSampler[2]; // U,V SAMPLER

    void main() {
        vec3 nor = normalize(vNor);
        float c = .1 + max(0., dot(vec3( .5),nor))
                    + max(0., dot(vec3(-.5),nor));

        // SAMPLE THE TEXTURE AT THIS U,V

        vec4 T = texture(uSampler[0], vUV);
        fragColor = vec4(sqrt(c)*uColor*T.rgb, 1.);
    }
  `;

  function update() {
    // Update texture from filter FBO.
    const fbw = filterFBO.fboWidth || width;
    const fbh = filterFBO.fboHeight || height;
    updateTextureFromFBO(filterFBO.gl, filterFBO.fbo, gl, sphereTexture, fbw, fbh);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sphereTexture);

    // Draw mesh.
    setUniform(gl, "1iv", "uSampler", [0, 1]);
    const vertexSize = vertexMap(gl, ["aPos", 3, "aNor", 3, "aUV", 2]);
    const time = (Date.now() / 1000 - startTime) / 2;
    const matrix = M.mxm(M.turnY(time), M.mxm(M.turnX(time), M.scale(0.7)));
    drawObj(gl, mesh, matrix, vertexSize, [1, 1, 1]);
  }

  _.start = function () {
    mesh = {triangle_strip: true, data: new Float32Array(sphereMesh(40, 20))};
    gl = contextGL2({parent, width, height, vertexShader, fragmentShader});
    sphereTexture = createTexture(gl, 0);
    timer = d3.interval(update, 10);
  };

  _.destroy = function () {
    timer.stop();
    timer = null;
  };

  return _;
}
