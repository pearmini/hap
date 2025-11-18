import * as d3 from "d3";
import {contextGL2, addTexture, vertexMap, createFBO, bindFBO, unbindFBO} from "./helper";

export function FilterGL2(parent, {image, width, height}) {
  const _ = {};

  const vertexShader = `\
  #version 300 es
  in vec2 aPos;
  in vec2 aUV;
  in vec4 aColor;
  out vec2 vUV;
  out vec4 vColor;
  void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
      vUV = aUV;
      vColor = aColor;
  }`;

  const fragmentShader = `\
  #version 300 es
  precision highp float;
  in vec2 vUV;
  in vec4 vColor;
  uniform sampler2D u_texture;
  uniform vec4 u_colors[1000];
  out vec4 outColor;

  void main() {
    vec4 T = texture(u_texture, vUV);
    if (vColor.a < 0.) {
      float gray = dot(T.rgb, vec3(0.2126, 0.7152, 0.0722)) * 0.4;
      outColor = vec4(gray, gray, gray, 1.);
    } else {
      outColor = sqrt(T) * vColor;
    }
  }`;

  const gl = contextGL2({parent, width, height, vertexShader, fragmentShader});
  addTexture(gl, 0, image);
  vertexMap(gl, ["aPos", 2, "aUV", 2, "aColor", 4]);

  // Create FBO for rendering
  const fboData = createFBO(gl, 1, width, height);
  _.fboTexture = fboData.texture;
  _.fbo = fboData.fbo;
  _.gl = gl;
  _.fboWidth = width;
  _.fboHeight = height;

  const scaleX = d3.scaleLinear().domain([0, width]).range([-1, 1]);
  const scaleY = d3.scaleLinear().domain([0, height]).range([1, -1]);
  const scaleUVX = d3.scaleLinear().domain([-1, 1]).range([0, 1]);
  const scaleUVY = d3.scaleLinear().domain([1, -1]).range([0, 1]);

  _.fillPolygons = (I, P, C) => {
    const triangles = I.map((i) => {
      const polygon = P[i];
      const {points, triangles} = d3.Delaunay.from(polygon);
      const n = triangles.length / 3;
      const ps = [];
      const [r, g, b, a] = C[i];
      for (let i = 0; i < n; i++) {
        const t0 = triangles[i * 3 + 0];
        const t1 = triangles[i * 3 + 1];
        const t2 = triangles[i * 3 + 2];
        const x0 = scaleX(points[t0 * 2]);
        const y0 = scaleY(points[t0 * 2 + 1]);
        const x1 = scaleX(points[t1 * 2]);
        const y1 = scaleY(points[t1 * 2 + 1]);
        const x2 = scaleX(points[t2 * 2]);
        const y2 = scaleY(points[t2 * 2 + 1]);
        // prettier-ignore
        ps.push([
          x0, y0, scaleUVX(x0), scaleUVY(y0), r, g, b, a,
          x1, y1, scaleUVX(x1), scaleUVY(y1), r, g, b, a,
          x2, y2, scaleUVX(x2), scaleUVY(y2), r, g, b, a,
        ]);
      }
      return ps;
    });
    const T = triangles.flat(Infinity);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(T), gl.STATIC_DRAW);

    // Render to FBO first
    bindFBO(gl, fboData.fbo, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, T.length / 8);

    // Then render to screen
    unbindFBO(gl);
    gl.drawArrays(gl.TRIANGLES, 0, T.length / 8);
  };

  _.fillRect = (x, y, w, h, c) => {
    const rect = [
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
      ],
    ];
    _.fillPolygons([0], rect, [c]);
  };
  return _;
}
