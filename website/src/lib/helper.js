export const M = (() => {
  const m = {};
  let c = (t) => Math.cos(t);
  let s = (t) => Math.sin(t);

  m.identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; // prettier-ignore
  m. move = (x,y,z) => {if (y===undefined) {z=x[2];y=x[1];x=x[0];} return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];} // prettier-ignore
  m.turnX = t => [1,0,0,0, 0,c(t),s(t),0, 0,-s(t),c(t),0, 0,0,0,1]; // prettier-ignore
  m.turnY = t => [c(t),0,-s(t),0, 0,1,0,0, s(t),0,c(t),0, 0,0,0,1]; // prettier-ignore
  m.turnZ = t => [c(t),s(t),0,0, -s(t),c(t),0,0, 0,0,1,0, 0,0,0,1]; // prettier-ignore
  m.turnZ = t => [c(t),s(t),0,0, -s(t),c(t),0,0, 0,0,1,0, 0,0,0,1]; // prettier-ignore
  m.scale = (x,y,z) => [x,0,0,0, 0,y??x,0,0, 0,0,z??x,0, 0,0,0,1]; // prettier-ignore
  m.perspective = (x,y,z) => [1,0,0,x, 0,1,0,y??x, 0,0,1,z??x, 0,0,0,1]; // prettier-ignore

  // Multiply two matrices.
  m.mxm = (a, b) => {
    let m = [];
    for (let c = 0; c < 16; c += 4) {
      for (let r = 0 ; r < 4 ; r++)
        m.push( a[r]*b[c] + a[r+4]*b[c+1] + a[r+8]*b[c+2] + a[r+12]*b[c+3] ); // prettier-ignore
    }
    return m;
  };

  // Invert a matrix.
  m.inverse = (src) => {
    let dst = [],
      det = 0,
      cofactor = (c, r) => {
        let s = (i, j) => src[((c + i) & 3) | (((r + j) & 3) << 2)];
        // prettier-ignore
        return (c+r & 1 ? -1 : 1) * ( (s(1,1)*(s(2,2)*s(3,3)-s(3,2)*s(2,3)))
                                  - (s(2,1)*(s(1,2)*s(3,3)-s(3,2)*s(1,3)))
                                  + (s(3,1)*(s(1,2)*s(2,3)-s(2,2)*s(1,3))) );
      };
    for (let n = 0 ; n < 16 ; n++) dst.push(cofactor(n >> 2, n & 3)); // prettier-ignore
    for (let n = 0 ; n <  4 ; n++) det += src[n] * dst[n << 2]; // prettier-ignore
    for (let n = 0 ; n < 16 ; n++) dst[n] /= det; // prettier-ignore
    return dst;
  };

  m.aim = (Z) => {
    // prettier-ignore
    let X = V.normalize(V.cross([0,1,0], Z = V.normalize(Z))),
       Y = V.normalize(V.cross(Z, X));
    return [ X[0],X[1],X[2],0, Y[0],Y[1],Y[2],0, Z[0],Z[1],Z[2],0, 0,0,0,1 ]; // prettier-ignore
  };

  return m;
})();

export function Matrix() {
  // prettier-ignore
  let aim = Z => {
    let X = V.normalize(V.cross([0,1,0], Z = V.normalize(Z))),
        Y = V.normalize(V.cross(Z, X));
    return [ X[0],X[1],X[2],0, Y[0],Y[1],Y[2],0, Z[0],Z[1],Z[2],0, 0,0,0,1 ];
  }
  let m = [M.identity()], top = 0; // prettier-ignore
  this.aim         = Z       => { m[top] = M.mxm(m[top],aim(Z)); return this; } // prettier-ignore
  this.call        = proc    => { proc(); return this; } // prettier-ignore
  this.get         = ()      => m[top]; // prettier-ignore
  this.identity    = ()      => { m[top] = M.identity(); return this; } // prettier-ignore
  this.inverse     = ()      => { m[top] = M.inverse(m[top]); return this; } // prettier-ignore
  this.move        = (x,y,z) => { m[top] = M.mxm(m[top], M.move(x,y,z)); return this; } // prettier-ignore
  this.perspective = (x,y,z) => { m[top] = M.mxm(m[top], M.perspective(x,y,z)); return this; } // prettier-ignore
  this.pop         = ()      => { if (top > 0) top--; return this; } // prettier-ignore
  this.push        = ()      => { m[top+1] = m[top].slice(); top++; return this; } // prettier-ignore
  this.scale       = (x,y,z) => { m[top] = M.mxm(m[top], M.scale(x,y,z)); return this; } // prettier-ignore
  this.set         = matrix  => { m[top] = matrix; return this; } // prettier-ignore
  this.transform   = p       => { m[top] = M.transform(m[top],p); return this; } // prettier-ignore
  this.transpose   = ()      => { m[top] = M.transpose(m[top]); return this; } // prettier-ignore
  this.turnX       = a       => { m[top] = M.mxm(m[top], M.turnX(a)); return this; } // prettier-ignore
  this.turnY       = a       => { m[top] = M.mxm(m[top], M.turnY(a)); return this; } // prettier-ignore
  this.turnZ       = a       => { m[top] = M.mxm(m[top], M.turnZ(a)); return this; } // prettier-ignore
}

export const contextGL2 = (() => {
  let noiseCode = `
vec3  _s(vec3 i) { return cos(5.*(i+5.*cos(5.*(i.yzx+5.*cos(5.*(i.zxy+5.*cos(5.*i))))))); }
float _t(vec3 i, vec3 u, vec3 a) { return dot(normalize(_s(i + a)), u - a); }
float noise(vec3 p) {
   vec3 i = floor(p), u = p - i, v = 2.*mix(u*u, u*(2.-u)-.5, step(.5,u));
   return mix(mix(mix(_t(i, u, vec3(0.,0.,0.)), _t(i, u, vec3(1.,0.,0.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,0.)), _t(i, u, vec3(1.,1.,0.)), v.x), v.y),
              mix(mix(_t(i, u, vec3(0.,0.,1.)), _t(i, u, vec3(1.,0.,1.)), v.x),
                  mix(_t(i, u, vec3(0.,1.,1.)), _t(i, u, vec3(1.,1.,1.)), v.x), v.y), v.z);
}`;
  let phongCode = `
vec3 phong(vec3 N, vec3 L, vec3 W, vec3 diffuse, vec4 specular) {
   vec3 R = 2. * N * dot(N,L) - L;
   return diffuse      * max(0., dot(N, L)) +
          specular.rgb * pow(max(0.,dot(R,-W)), specular.a);
}
`;

  return (scene) => {
    const canvas = document.createElement("canvas");
    scene.parent.appendChild(canvas);
    canvas.width = scene.width ?? 640;
    canvas.height = scene.height ?? 640;
    const gl = canvas.getContext("webgl2");
    canvas.setShaders = function (vertexShader, fragmentShader) {
      gl.program = gl.createProgram();
      function addshader(type, src) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          console.log("Cannot compile shader:", gl.getShaderInfoLog(shader));
        gl.attachShader(gl.program, shader);
      }
      addshader(gl.VERTEX_SHADER, vertexShader);
      let i = fragmentShader.indexOf("float") + 6;
      addshader(
        gl.FRAGMENT_SHADER,
        fragmentShader.substring(0, i) + noiseCode + phongCode + fragmentShader.substring(i)
      );
      gl.linkProgram(gl.program);
      if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) console.log("Could not link the shader program!");
      gl.useProgram(gl.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      // vertexMap(gl, ["aPos", 3, "aNor", 3]);
    };
    canvas.setShaders(scene.vertexShader.trim(), scene.fragmentShader.trim());
    const timer = setInterval(function () {
      if (scene.update) scene.update(gl, [0, 0, 7]);
      if (scene.mesh) drawMesh(gl, scene.mesh);
    }, 30);
    canvas.gl = gl;
    canvas.gl.width = canvas.width;
    canvas.gl.height = canvas.height;
    canvas.remove = () => clearInterval(timer);
    const style = scene.style ?? {};
    style.background ??= "black";
    style.padding ??= "0px";
    for (const [key, value] of Object.entries(style)) canvas.style[key] = value;
    return gl;
  };
})();

export function drawMesh(gl, mesh, vertexSize = 6) {
  gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
  gl.drawArrays(mesh.triangle_strip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, mesh.data.length / vertexSize);
}

export const V = (() => {
  const V = {};
  V.add = (a,b) => { let v = []; for (let i=0 ; i<a.length ; i++) v.push(a[i] + b[i]); return v; } // prettier-ignore
  V.cross = (a,b) => [ a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0] ]; // prettier-ignore
  V.dot = (a,b) => { let s = 0 ; for (let i=0 ; i<a.length ; i++) s += a[i] * b[i]; return s; } // prettier-ignore
  V.ease = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - t - t); } // prettier-ignore
  V.evalBezier = (B,t) => (1-t)*(1-t)*(1-t)*B[0] + 3*(1-t)*(1-t)*t*B[1] + 3*(1-t)*t*t*B[2] + t*t*t*B[3]; // prettier-ignore
  V.mix = (a,b,t) => { let c = []; for (let i=0 ; i<a.length ; i++) c[i] = a[i] + t*(b[i]-a[i]); return c; } // prettier-ignore
  V.norm = v => Math.sqrt(V.dot(v,v)); // prettier-ignore
  V.normalize = v => { let s = V.norm(v); return v.length==3 ? [ v[0]/s,v[1]/s,v[2]/s ] : [ v[0]/s,v[1]/s ]; } // prettier-ignore
  V.resize = (v,s) => v.length==2 ? [ s*v[0], s*v[1] ] : [s*v[0], s*v[1], s*v[2] ]; // prettier-ignore
  V.subtract = (a,b) => { let v = []; for (let i=0 ; i<a.length ; i++) v.push(a[i] - b[i]); return v; } // prettier-ignore
  return V;
})();

export function setUniform(gl, type, name, a, b, c) {
  return gl["uniform" + type](gl.getUniformLocation(gl.program, name), a, b, c);
}

export function addTexture(gl, index, image) {
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // SPECIFY HOW SRC IMAGE WILL BE LAID OUT
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // SPECIFY HOW IT'S FILTERED WHEN MAGNIFIED
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); // SPECIFY HOW IT'S FILTERED WHEN VERY SMALL
  gl.generateMipmap(gl.TEXTURE_2D); // GENERATE THE MIP MAP PYRAMID
}

export function vertexMap(gl, map) {
  let vertexAttribute = (name, size, position) => {
    let attr = gl.getAttribLocation(gl.program, name);
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, size, gl.FLOAT, false, vertexSize * 4, position * 4);
  };
  let vertexSize = 0;
  for (let n = 0; n < map.length; n += 2) vertexSize += map[n + 1];
  let index = 0;
  for (let n = 0; n < map.length; n += 2) {
    vertexAttribute(map[n], map[n + 1], index);
    index += map[n + 1];
  }
}
