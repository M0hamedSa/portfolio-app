import * as THREE from "three";

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────
const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.); }`;
const p = `precision highp float;`;
const s = `precision mediump sampler2D;`;

const shaders = {
  splat: [
    vert,
    `${p} ${s}
    uniform sampler2D uTarget; uniform float aspectRatio,radius;
    uniform vec3 color; uniform vec2 point; varying vec2 vUv;
    void main(){ vec2 p=vUv-point; p.x*=aspectRatio; gl_FragColor=vec4
    (texture2D(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.); }`,
  ],

  advection: [
    vert,
    `${p} ${s}
    uniform sampler2D uVelocity,uSource; uniform vec2 texelSize;
    uniform float dt,dissipation; varying vec2 vUv;
    void main(){gl_FragColor=vec4(dissipation*texture2D(uSource,
    vUv-dt*texture2D(uVelocity,vUv).xy*texelSize).rgb,1.); }`,
  ],

  divergence: [
    vert,
    `${p} ${s}
    uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    vec2 vel(vec2 uv){ vec2 e=vec2(1.); if(uv.x<0.){uv.x=0.; e.x=-1.; } if(uv.
    x>1.){uv.x=1.; e.x=-1.; }if(uv.y<0.){uv.y=0.; e.y=-1.; } if(uv.y>1.){uv.
    y=1.; e.y=-1.; } return e*texture2D(uVelocity,uv).xy; }
    void main(){vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
    T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); gl_FragColor=vec4
    (.5*(vel(R).x-vel(L).x+vel(T).y-vel(B).y),0.,0.,1.); }`,
  ],

  curl: [
    vert,
    `${p} ${s}
    uniform sampler2D uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    void main(){vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
    T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); gl_FragColor=vec4
    (texture2D(uVelocity,R).y-texture2D(uVelocity,L).y-texture2D(uVelocity,
    T).x+texture2D(uVelocity,B).x,0.,0.,1.); }`,
  ],

  vorticity: [
    vert,
    `${p} ${s}
    uniform sampler2D uVelocity,uCurl; uniform vec2 texelSize;
    uniform float curlStrength,dt; varying vec2 vUv;
    void main(){ vec2 L=vUv-vec2(texelSize.x,0.),R=vUv+vec2(texelSize.x,0.),
    T=vUv+vec2(0.,texelSize.y),B=vUv-vec2(0.,texelSize.y); vec2 f=normalize
    (vec2(abs(texture2D(uCurl,T).x)-abs(texture2D(uCurl,B).x),abs(texture2D
    (uCurl,R).x)-abs(texture2D(uCurl,L).x))+.0001)*curlStrength*texture2D
    (uCurl,vUv).x; gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+f*dt,0.,1.); }`,
  ],

  pressure: [
    vert,
    `${p} ${s}
    uniform sampler2D uPressure,uDivergence; uniform vec2 texelSize; varying vec2 vUv;
    void main(){ vec2 L=clamp(vUv-vec2(texelSize.x,0.),0.,1.),R=clamp(vUv
    +vec2(texelSize.x,0.),0.,1.),T=clamp(vUv+vec2(0.,texelSize.y),0.,1.),
    B=clamp(vUv-vec2(0.,texelSize.y),0.,1.); gl_FragColor=vec4((texture2D
    (uPressure,L).x+texture2D(uPressure,R).x+texture2D(uPressure,T).x
    +texture2D(uPressure,B).x-texture2D(uDivergence,vUv).x)*.25,0.,0.,1.); }`,
  ],

  gradientSubtract: [
    vert,
    `${p} ${s}
    uniform sampler2D uPressure,uVelocity; uniform vec2 texelSize; varying vec2 vUv;
    void main(){float pL=texture2D(uPressure,clamp(vUv-vec2(texelSize.x,0.),
    0.,1.)).x,pR=texture2D(uPressure,clamp(vUv+vec2(texelSize.x,0.),0.,1.)).x,
    pT=texture2D(uPressure,clamp(vUv+vec2(0.,texelSize.y),0.,1.)).x,
    pB=texture2D(uPressure,clamp(vUv-vec2(0.,texelSize.y),0.,1.)).x;
    gl_FragColor=vec4(texture2D(uVelocity,vUv).xy-vec2(pR-pL,pT-pB),0.,1.); }`,
  ],

  clear: [
    vert,
    `${p} ${s}
    uniform sampler2D uTexture; uniform float value; varying vec2 vUv;
    void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`,
  ],

  // display uses premultiplied output (inkColor*a, a) so transparent pixels are truly (0,0,0,0)
  display: [
    vert,
    `${p}
    uniform sampler2D uTexture; uniform float threshold,edgeSoftness;
    uniform vec3 inkColor; varying vec2 vUv;
    void main(){ float d=clamp(length(texture2D(uTexture,vUv).rgb),0.,1.);
    float a=edgeSoftness>0.?smoothstep(threshold-edgeSoftness*.5,threshold
    +edgeSoftness*.5,d):step(threshold,d); gl_FragColor=vec4(inkColor*a,a); }`,
  ],
};

// ─── Config ───────────────────────────────────────────────────────────────────
export interface FluidConfig {
  simResolution: number;
  dyeResolution: number;
  curl: number;
  pressureIterations: number;
  velocityDissipation: number;
  dyeDissipation: number;
  splatRadius: number;
  forceStrength: number;
  pressureDecay: number;
  threshold: number;
  edgeSoftness: number;
  inkColor: THREE.Color;
}

export const DEFAULT_CONFIG: FluidConfig = {
  simResolution: 256,
  dyeResolution: 1024,
  curl: 25,
  pressureIterations: 50,
  velocityDissipation: 0.95,
  dyeDissipation: 0.95,
  splatRadius: 0.275,
  forceStrength: 7.5,
  pressureDecay: 0.75,
  threshold: 1.0,
  edgeSoftness: 0.0,
  inkColor: new THREE.Color(1, 1, 1),
};

// ─── Types ────────────────────────────────────────────────────────────────────
type DoubleTarget = {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap(): void;
};

// ─── FluidSimulation ──────────────────────────────────────────────────────────
export class FluidSimulation {
  private config: FluidConfig;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private quad!: THREE.Mesh;

  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private divergence!: THREE.WebGLRenderTarget;
  private curl!: THREE.WebGLRenderTarget;
  private pressure!: DoubleTarget;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private material!: Record<string, THREE.ShaderMaterial>;

  private mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, moved: false };
  private dpr = 1;
  private width = 0;
  private height = 0;

  private rafId = 0;
  private container: HTMLElement;

  private _onMouseMove: (e: MouseEvent) => void;
  private _onTouchMove: (e: TouchEvent) => void;
  private _onResize: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    container: HTMLElement,
    config: Partial<FluidConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.container = container;

    this._onMouseMove = (e: MouseEvent) => {
      const rect = this.container.getBoundingClientRect();
      this._onMove(e.clientX - rect.left, e.clientY - rect.top);
    };

    this._onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = this.container.getBoundingClientRect();
      this._onMove(
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      );
    };

    this._onResize = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setSize(w, h);
      this.width = w * this.dpr;
      this.height = h * this.dpr;
    };

    this._setupRenderer(canvas);
    this._setupScene();
    this._setupTargets();
    this._setupMaterials();
    this._setupInput();
    this._loop();
  }

  private _setupRenderer(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.dpr = this.renderer.getPixelRatio();
    this.width = w * this.dpr;
    this.height = h * this.dpr;

    window.addEventListener("resize", this._onResize);
  }

  private _setupScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.scene.add(this.quad);
  }

  private _setupTargets() {
    const { simResolution: simRes, dyeResolution: dyeRes } = this.config;
    const aspect = this.width / this.height;
    const options: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      depthBuffer: false,
    };

    const single = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, options);

    const double = (w: number, h: number): DoubleTarget => ({
      read: single(w, h),
      write: single(w, h),
      swap() {
        [this.read, this.write] = [this.write, this.read];
      },
    });

    const simSize = { w: simRes, h: Math.round(simRes / aspect) };
    const dyeSize = { w: dyeRes, h: Math.round(dyeRes / aspect) };

    this.velocity = double(simSize.w, simSize.h);
    this.dye = double(dyeSize.w, dyeSize.h);
    this.divergence = single(simSize.w, simSize.h);
    this.curl = single(simSize.w, simSize.h);
    this.pressure = double(simSize.w, simSize.h);
  }

  private _setupMaterials() {
    const make = (
      [vert, frag]: string[],
      uniforms: THREE.ShaderMaterialParameters["uniforms"]
    ) => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms });

    const tex = () => ({ value: null as THREE.Texture | null });
    const num = (v = 0) => ({ value: v });
    const vec2 = () => ({ value: new THREE.Vector2() });

    this.material = {
      splat: make(shaders.splat, {
        uTarget: tex(),
        aspectRatio: num(),
        radius: num(),
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
      }),
      advection: make(shaders.advection, {
        uVelocity: tex(),
        uSource: tex(),
        texelSize: vec2(),
        dt: num(),
        dissipation: num(),
      }),
      divergence: make(shaders.divergence, {
        uVelocity: tex(),
        texelSize: vec2(),
      }),
      curl: make(shaders.curl, { uVelocity: tex(), texelSize: vec2() }),
      vorticity: make(shaders.vorticity, {
        uVelocity: tex(),
        uCurl: tex(),
        texelSize: vec2(),
        curlStrength: num(),
        dt: num(),
      }),
      pressure: make(shaders.pressure, {
        uPressure: tex(),
        uDivergence: tex(),
        texelSize: vec2(),
      }),
      gradientSubtract: make(shaders.gradientSubtract, {
        uPressure: tex(),
        uVelocity: tex(),
        texelSize: vec2(),
      }),
      clear: make(shaders.clear, { uTexture: tex(), value: num() }),
      display: make(shaders.display, {
        uTexture: tex(),
        threshold: num(),
        edgeSoftness: num(),
        inkColor: { value: new THREE.Color() },
      }),
    };
  }

  private _setupInput() {
    this.container.addEventListener("mousemove", this._onMouseMove);
    this.container.addEventListener("touchmove", this._onTouchMove, {
      passive: false,
    });
  }

  private _onMove(x: number, y: number) {
    this.mouse.velocityX =
      (x * this.dpr - this.mouse.x) * this.config.forceStrength;
    this.mouse.velocityY =
      (y * this.dpr - this.mouse.y) * this.config.forceStrength;
    this.mouse.x = x * this.dpr;
    this.mouse.y = y * this.dpr;
    this.mouse.moved = true;
  }

  private _pass(
    material: THREE.ShaderMaterial,
    target: THREE.WebGLRenderTarget | null
  ) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private _set(
    material: THREE.ShaderMaterial,
    values: Record<string, unknown>
  ) {
    Object.entries(values).forEach(([key, val]) => {
      material.uniforms[key].value = val;
    });
    return material;
  }

  private _splat(x: number, y: number, vx: number, vy: number) {
    const { material: m, velocity: vel, dye, width, height, config: c } = this;

    this._set(m.splat, {
      aspectRatio: width / height,
      point: new THREE.Vector2(x / width, 1 - y / height),
      radius: c.splatRadius / 100,
    });

    this._set(m.splat, {
      uTarget: vel.read.texture,
      color: new THREE.Vector3(vx, -vy, 0),
    });
    this._pass(m.splat, vel.write);
    vel.swap();

    this._set(m.splat, {
      uTarget: dye.read.texture,
      color: new THREE.Vector3(3, 3, 3),
    });
    this._pass(m.splat, dye.write);
    dye.swap();
  }

  private _simulate(dt: number) {
    const {
      material: m,
      velocity: vel,
      dye,
      divergence: div,
      curl,
      pressure: pres,
      config: c,
    } = this;

    const simW = this.velocity.read.width;
    const simH = this.velocity.read.height;
    const dyeW = this.dye.read.width;
    const dyeH = this.dye.read.height;
    const simTexel = new THREE.Vector2(1 / simW, 1 / simH);

    this._pass(
      this._set(m.curl, { uVelocity: vel.read.texture, texelSize: simTexel }),
      curl
    );
    this._pass(
      this._set(m.vorticity, {
        uVelocity: vel.read.texture,
        uCurl: curl.texture,
        texelSize: simTexel,
        curlStrength: c.curl,
        dt,
      }),
      vel.write
    );
    vel.swap();

    this._pass(
      this._set(m.divergence, {
        uVelocity: vel.read.texture,
        texelSize: simTexel,
      }),
      div
    );
    this._pass(
      this._set(m.clear, { uTexture: pres.read.texture, value: c.pressureDecay }),
      pres.write
    );
    pres.swap();

    this._set(m.pressure, { uDivergence: div.texture, texelSize: simTexel });
    for (let i = 0; i < c.pressureIterations; i++) {
      m.pressure.uniforms.uPressure.value = pres.read.texture;
      this._pass(m.pressure, pres.write);
      pres.swap();
    }

    this._pass(
      this._set(m.gradientSubtract, {
        uPressure: pres.read.texture,
        uVelocity: vel.read.texture,
        texelSize: simTexel,
      }),
      vel.write
    );
    vel.swap();

    this._set(m.advection, {
      uVelocity: vel.read.texture,
      uSource: vel.read.texture,
      texelSize: simTexel,
      dt,
      dissipation: c.velocityDissipation,
    });
    this._pass(m.advection, vel.write);
    vel.swap();

    this._set(m.advection, {
      uSource: dye.read.texture,
      texelSize: new THREE.Vector2(1 / dyeW, 1 / dyeH),
      dissipation: c.dyeDissipation,
    });
    this._pass(m.advection, dye.write);
    dye.swap();
  }

  private _render() {
    this._pass(
      this._set(this.material.display, {
        uTexture: this.dye.read.texture,
        threshold: this.config.threshold,
        edgeSoftness: this.config.edgeSoftness,
        inkColor: this.config.inkColor,
      }),
      null
    );
  }

  private _loop() {
    let lastTime = Date.now();
    const tick = () => {
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      if (this.mouse.moved) {
        this._splat(
          this.mouse.x,
          this.mouse.y,
          this.mouse.velocityX,
          this.mouse.velocityY
        );
        this.mouse.moved = false;
      }

      this._simulate(dt);
      this._render();
      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  /** Clean up all GPU resources and event listeners */
  destroy() {
    cancelAnimationFrame(this.rafId);
    this.container.removeEventListener("mousemove", this._onMouseMove);
    this.container.removeEventListener("touchmove", this._onTouchMove);
    window.removeEventListener("resize", this._onResize);

    this.velocity.read.dispose();
    this.velocity.write.dispose();
    this.dye.read.dispose();
    this.dye.write.dispose();
    this.divergence.dispose();
    this.curl.dispose();
    this.pressure.read.dispose();
    this.pressure.write.dispose();

    Object.values(this.material).forEach((m) => m.dispose());
    this.renderer.dispose();
  }
}
