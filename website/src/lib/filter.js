import * as d3 from "d3";
import {contextGL2, addTexture, vertexMap} from "./helper";

export function FilterGL2(parent, {image, width, height}) {
  const _ = {};

  const vertexShader = `\
  #version 300 es
  in vec2 a_position;
  in vec2 a_texcoord;
  in vec4 a_color;
  out vec2 v_texcoord;
  out vec4 v_color;

  void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texcoord = a_texcoord;
      v_color = a_color;
  }`;

  const fragmentShader = `\
  #version 300 es
  precision highp float;
  in vec2 v_texcoord;
  in vec4 v_color;
  uniform sampler2D u_texture;
  uniform vec4 u_colors[1000];
  out vec4 outColor;

  void main() {
    outColor = sqrt(texture(u_texture, v_texcoord)) * v_color;
  }`;

  const gl = contextGL2({parent, width, height, vertexShader, fragmentShader});
  addTexture(gl, 0, image);
  vertexMap(gl, ["a_position", 2, "a_texcoord", 2, "a_color", 4]);

  _.fillPolygons = (I, P, C) => {
    const scaleX = d3.scaleLinear().domain([0, width]).range([-1, 1]);
    const scaleY = d3.scaleLinear().domain([0, height]).range([1, -1]);
    const scaleUVX = d3.scaleLinear().domain([-1, 1]).range([0, 1]);
    const scaleUVY = d3.scaleLinear().domain([1, -1]).range([0, 1]);
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
    gl.drawArrays(gl.TRIANGLES, 0, T.length / 8);
  };

  return _;
}
