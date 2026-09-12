import { add, cross, createHeartMeshes, mul, normalize, sub, type Camera, type LeadView, type Vec3 } from '../domain/heart3d';

export function createHeartRenderer(canvas: HTMLCanvasElement, colors: { right: Vec3; left: Vec3; coronary: Vec3 }) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) throw new Error('3D描画に対応したブラウザで開いてね。下の誘導ボタンから説明は読めるよ。');
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!; gl.shaderSource(s,source); gl.compileShader(s);
    if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) { const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message || '3D描画の準備に失敗したよ。'); }
    return s;
  };
  const vs=shader(gl.VERTEX_SHADER,`
    attribute vec3 position; attribute vec3 normal; attribute float rightWeight;
    uniform vec2 rotation; uniform vec2 scale;
    varying vec3 point; varying vec3 shadingNormal; varying float rightMix;
    vec3 turn(vec3 p) {
      float c=cos(rotation.x),s=sin(rotation.x),a=cos(rotation.y),b=sin(rotation.y);
      vec3 v=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
      return vec3(v.x,a*v.y-b*v.z,b*v.y+a*v.z);
    }
    void main(){ point=position;shadingNormal=turn(normal);rightMix=rightWeight;vec3 v=turn(position);
      float w=8.0-v.z;gl_Position=vec4(v.xy*scale*8.0,(w-8.0)*.16*w,w);
    }`);
  const fs=shader(gl.FRAGMENT_SHADER,`
    precision mediump float;
    varying vec3 point; varying vec3 shadingNormal; varying float rightMix;
    uniform vec3 rightColor; uniform vec3 leftColor;
    uniform vec3 color; uniform vec3 target; uniform float radius;
    uniform float selected; uniform float anatomical; uniform float cone;
    void main(){
      if(cone>.5){gl_FragColor=vec4(1.0,.86,.45,.075);return;}
      vec3 n=normalize(shadingNormal);
      float diffuse=max(0.0,dot(n,normalize(vec3(-.4,.8,1.4))));
      float rim=pow(1.0-abs(n.z),3.0)*.025;
      float spot=(1.0-smoothstep(radius*.25,radius,distance(point,target)))*selected*anatomical;
      vec3 tissue=mix(leftColor,rightColor,rightMix);
      vec3 pigment=mix(color,tissue,anatomical);
      // Broad diffuse lighting, no glossy specular lobe. Grain stays in model space.
      float grain=sin(point.x*117.0+sin(point.z*93.0))*sin(point.y*103.0)*.006;
      vec3 base=pigment*(.59+.32*diffuse+rim+grain)*(1.0-selected*.2*anatomical);
      base=mix(base,vec3(1.0,.83,.36),spot*.78)+spot*.12;
      gl_FragColor=vec4(base,1.0);
    }`);
  const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('3D描画を開始できなかったよ。');
  gl.useProgram(program);
  const positions=gl.getAttribLocation(program,'position'),normals=gl.getAttribLocation(program,'normal'),rightWeight=gl.getAttribLocation(program,'rightWeight');
  const uniforms=Object.fromEntries(['rotation','scale','color','rightColor','leftColor','target','radius','selected','anatomical','cone'].map(k=>[k,gl.getUniformLocation(program,k)]));
  gl.uniform3fv(uniforms.rightColor,colors.right);gl.uniform3fv(uniforms.leftColor,colors.left);
  const meshes=createHeartMeshes(colors.right,colors.left,colors.coronary).map(m=>{
    const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,m.vertices,gl.STATIC_DRAW);
    const weightBuffer=m.rightWeights?gl.createBuffer():null;
    if(weightBuffer){gl.bindBuffer(gl.ARRAY_BUFFER,weightBuffer);gl.bufferData(gl.ARRAY_BUFFER,m.rightWeights!,gl.STATIC_DRAW);}
    return {...m,buffer,weightBuffer,count:m.vertices.length/6};
  });
  const coneBuffer=gl.createBuffer()!;
  let lastLead: string | undefined;
  let coneCount=0;
  function drawBuffer(buffer: WebGLBuffer,count:number,weightBuffer:WebGLBuffer|null=null) {
    if(weightBuffer){gl!.bindBuffer(gl!.ARRAY_BUFFER,weightBuffer);gl!.enableVertexAttribArray(rightWeight);gl!.vertexAttribPointer(rightWeight,1,gl!.FLOAT,false,0,0);}
    else{gl!.disableVertexAttribArray(rightWeight);gl!.vertexAttrib1f(rightWeight,0);}
    gl!.bindBuffer(gl!.ARRAY_BUFFER,buffer);
    gl!.enableVertexAttribArray(positions);gl!.vertexAttribPointer(positions,3,gl!.FLOAT,false,24,0);
    gl!.enableVertexAttribArray(normals);gl!.vertexAttribPointer(normals,3,gl!.FLOAT,false,24,12);
    gl!.drawArrays(gl!.TRIANGLES,0,count);
  }
  function render(camera: Camera, lead?: LeadView) {
    const width=canvas.clientWidth,height=canvas.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    gl!.viewport(0,0,canvas.width,canvas.height);gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);
    gl!.useProgram(program);gl!.enable(gl!.DEPTH_TEST);gl!.depthMask(true);gl!.disable(gl!.BLEND);
    gl!.uniform2f(uniforms.rotation,camera.yaw,camera.pitch);
    const unit=.3*Math.min(width,height)*camera.zoom;
    gl!.uniform2f(uniforms.scale,unit/width,unit/height);
    gl!.uniform3fv(uniforms.target,lead?.target||[0,0,0]);
    gl!.uniform1f(uniforms.radius,lead?.id==='aVR'?1.8:lead?.radius||1);
    gl!.uniform1f(uniforms.selected,lead?1:0);gl!.uniform1f(uniforms.cone,0);
    for(const mesh of meshes){gl!.uniform3fv(uniforms.color,mesh.color);gl!.uniform1f(uniforms.anatomical,mesh.anatomical?1:0);drawBuffer(mesh.buffer,mesh.count,mesh.weightBuffer);}
    if(lead){
      if(lastLead!==lead.id){
        const axis=normalize(sub(lead.target,lead.position)),basis=normalize(cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),other=cross(axis,basis);
        const data:number[]=[];
        const center=lead.target,r=lead.id==='aVR'?.72:lead.radius*.7;
        for(let i=0;i<48;i++){
          const circle=(a:number)=>add(center,add(mul(basis,Math.cos(a)*r),mul(other,Math.sin(a)*r)));
          for(const p of [lead.position,circle(i*Math.PI/24),circle((i+1)*Math.PI/24)])data.push(...p,0,0,1);
        }
        gl!.bindBuffer(gl!.ARRAY_BUFFER,coneBuffer);gl!.bufferData(gl!.ARRAY_BUFFER,new Float32Array(data),gl!.DYNAMIC_DRAW);coneCount=data.length/6;lastLead=lead.id;
      }
      gl!.enable(gl!.BLEND);gl!.blendFunc(gl!.SRC_ALPHA,gl!.ONE_MINUS_SRC_ALPHA);gl!.depthMask(false);gl!.uniform1f(uniforms.cone,1);drawBuffer(coneBuffer,coneCount);gl!.depthMask(true);
    }
  }
  return { render, dispose(){meshes.forEach(m=>{gl.deleteBuffer(m.buffer);if(m.weightBuffer)gl.deleteBuffer(m.weightBuffer);});gl.deleteBuffer(coneBuffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);} };
}
