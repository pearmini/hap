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
    const dpr = window.devicePixelRatio || 1;
    const width = scene.width ?? 640;
    const height = scene.height ?? 640;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
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
      // Set viewport to match the scaled resolution
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    canvas.setShaders(scene.vertexShader.trim(), scene.fragmentShader.trim());
    const timer = setInterval(function () {
      if (scene.update) scene.update(gl, [0, 0, 7]);
      if (scene.mesh) drawMesh(gl, scene.mesh);
    }, 30);
    canvas.gl = gl;
    gl.width = width;
    gl.height = height;
    gl.dpr = dpr;
    canvas.remove = () => clearInterval(timer);
    const style = scene.style ?? {};
    style.background ??= "black";
    style.padding ??= "0px";
    for (const [key, value] of Object.entries(style)) canvas.style[key] = value;
    return gl;
  };
})();

export function drawMesh(gl, mesh, vertexSize) {
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
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // SPECIFY HOW SRC IMAGE WILL BE LAID OUT
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // SPECIFY HOW IT'S FILTERED WHEN MAGNIFIED
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); // SPECIFY HOW IT'S FILTERED WHEN VERY SMALL
  gl.generateMipmap(gl.TEXTURE_2D); // GENERATE THE MIP MAP PYRAMID
  return texture;
}

export function createTexture(gl, index) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

// Create a Framebuffer Object.
export function createFBO(gl, index, width, height) {
  // Create texture for FBO.
  const texture = createTexture(gl, index);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // Create FBO.
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  // Check if FBO is complete.
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("FBO is not complete!");
  }

  // Unbind for safety.
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return {fbo, texture};
}

export function bindFBO(gl, fbo, width, height) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, width, height);
}

export function unbindFBO(gl) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // Use actual canvas dimensions (scaled by DPR) for viewport.
  const canvas = gl.canvas;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

export function addTextureFromFBO(gl, index, texture) {
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function updateTextureFromFBO(sourceGl, sourceFBO, targetGl, targetTexture, width, height) {
  // Bind source FBO and read pixels
  sourceGl.bindFramebuffer(sourceGl.FRAMEBUFFER, sourceFBO);
  const pixels = new Uint8Array(width * height * 4);
  sourceGl.readPixels(0, 0, width, height, sourceGl.RGBA, sourceGl.UNSIGNED_BYTE, pixels);
  sourceGl.bindFramebuffer(sourceGl.FRAMEBUFFER, null);

  // Upload to target texture
  targetGl.activeTexture(targetGl.TEXTURE0);
  targetGl.bindTexture(targetGl.TEXTURE_2D, targetTexture);
  targetGl.texImage2D(
    targetGl.TEXTURE_2D,
    0,
    targetGl.RGBA,
    width,
    height,
    0,
    targetGl.RGBA,
    targetGl.UNSIGNED_BYTE,
    pixels
  );
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
  return vertexSize;
}

export function useMouse(gl, parent, mouse = {}) {
  Object.assign(mouse, {isDown: false, x: 0, y: 0});
  const node = parent ?? document;
  const canvas = gl.canvas;
  const getCanvasCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {x, y};
  };
  const down = (e) => {
    mouse.isDown = true;
    const coords = getCanvasCoords(e);
    mouse.x = (coords.x - gl.width / 2) / (gl.width / 2);
    mouse.y = (gl.height / 2 - coords.y) / (gl.height / 2);
    if (mouse.down) mouse.down();
  };
  const move = (e) => {
    if (mouse.isDown) {
      const coords = getCanvasCoords(e);
      let x = (coords.x - gl.width / 2) / (gl.width / 2);
      let y = (gl.height / 2 - coords.y) / (gl.height / 2);
      if (mouse.drag) mouse.drag(x - mouse.x, y - mouse.y);
      mouse.x = x;
      mouse.y = y;
    }
  };
  const up = (e) => {
    if (mouse.up) mouse.up();
    mouse.isDown = false;
  };
  node.addEventListener("mousedown", down);
  node.addEventListener("mousemove", move);
  node.addEventListener("mouseup", up);
  mouse.destroy = () => {
    node.removeEventListener("mousedown", down);
    node.removeEventListener("mousemove", move);
    node.removeEventListener("mouseup", up);
  };
  return mouse;
}
