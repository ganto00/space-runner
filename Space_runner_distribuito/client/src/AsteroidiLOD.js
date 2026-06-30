import * as THREE from 'three';

export class AsteroidiLOD {
  constructor(n = 500) {
    this.n = n;
    this.material = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, flatShading: true });

    
    this.livelli = [
      { geo: new THREE.IcosahedronGeometry(0.5, 1), zMin: -20 },       // vicino:  80 triangoli
      { geo: new THREE.IcosahedronGeometry(0.5, 0), zMin: -55 },       // medio:   20 triangoli
      { geo: new THREE.OctahedronGeometry(0.5, 0),  zMin: -Infinity }, // lontano:  8 triangoli
    ];

    
    this.group = new THREE.Group();
    for (const liv of this.livelli) {
      const im = new THREE.InstancedMesh(liv.geo, this.material, n);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.count = 0;               
      im.frustumCulled = false;   
      liv.im = im;
      this.group.add(im);
    }

    this.dummy = new THREE.Object3D();

    this.posizioni = [];
    this.scale = [];
    this.spin = [];

    this.spawnZ = -100;
    this.despawnZ = 12;
    this.spread = 14;
    this.speed = 20;

    this.init();
  }

  init() {
    for (let i = 0; i < this.n; i++) {
      this.posizioni.push(new THREE.Vector3());
      this.scale.push(1);
      this.spin.push({ x: (Math.random() - 0.5) * 0.03, y: (Math.random() - 0.5) * 0.03, ax: 0, ay: 0 });
      this.reset(i, true);
    }
  }

  reset(i, initial = false) {
    const p = this.posizioni[i];
    p.x = (Math.random() - 0.5) * this.spread;
    p.y = (Math.random() - 0.5) * this.spread;
    p.z = initial ? Math.random() * this.spawnZ : this.spawnZ;
    this.scale[i] = 0.5 + Math.random() * 1.5;
  }

  
  scegliLivello(z) {
    if (z > this.livelli[0].zMin) return 0; // vicino
    if (z > this.livelli[1].zMin) return 1; // medio
    return 2;                               // lontano
  }

  update(dt) {
    const move = this.speed * dt;
    const conta = [0, 0, 0]; 

    for (let i = 0; i < this.n; i++) {
      const p = this.posizioni[i];
      p.z += move;
      this.spin[i].ax += this.spin[i].x;
      this.spin[i].ay += this.spin[i].y;
      if (p.z > this.despawnZ) this.reset(i);

      
      const d = this.dummy;
      d.position.copy(p);
      d.rotation.set(this.spin[i].ax, this.spin[i].ay, 0);
      d.scale.setScalar(this.scale[i]);
      d.updateMatrix();

      
      const L = this.scegliLivello(p.z);
      this.livelli[L].im.setMatrixAt(conta[L], d.matrix);
      conta[L]++;
    }

    
    for (let l = 0; l < this.livelli.length; l++) {
      this.livelli[l].im.count = conta[l];
      this.livelli[l].im.instanceMatrix.needsUpdate = true;
    }
  }
}