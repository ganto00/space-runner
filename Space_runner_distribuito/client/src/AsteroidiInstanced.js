import * as THREE from 'three';

export class AsteroidiInstanced { 
  constructor(n = 500) { 
    this.n = n;

    this.geometry = new THREE.IcosahedronGeometry(0.5, 1);
    this.material = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, flatShading: true });
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, n);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); 
    
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

  init() { //in reset poi cambio i valori
    for (let i = 0; i < this.n; i++) {
      this.posizioni.push(new THREE.Vector3()); 
      this.scale.push(1);
      this.spin.push({ x: (Math.random() - 0.5) * 0.03, y: (Math.random() - 0.5) * 0.03, ax: 0, ay: 0 });  
      this.reset(i, true);
    }
    this.scriviMatrici(); 
  }

  reset(i, initial = false) { //all'inizio sarà true poi quando usciranno sarà false 
    const p = this.posizioni[i];
    p.x = (Math.random() - 0.5) * this.spread;
    p.y = (Math.random() - 0.5) * this.spread;
    p.z = initial ? Math.random() * this.spawnZ : this.spawnZ;
    this.scale[i] = 0.5 + Math.random() * 1.5;
  }

  
  scriviMatrice(i) { 
    const d = this.dummy;
    d.position.copy(this.posizioni[i]);
    d.rotation.set(this.spin[i].ax, this.spin[i].ay, 0);
    d.scale.setScalar(this.scale[i]);
    d.updateMatrix();                       
    this.mesh.setMatrixAt(i, d.matrix);     
  }

  scriviMatrici() {
    for (let i = 0; i < this.n; i++) this.scriviMatrice(i);
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(dt) { 
    const move = this.speed * dt;
    for (let i = 0; i < this.n; i++) {
      this.posizioni[i].z += move;
      this.spin[i].ax += this.spin[i].x;   
      this.spin[i].ay += this.spin[i].y;
      if (this.posizioni[i].z > this.despawnZ) this.reset(i);
      this.scriviMatrice(i);
    }
    this.mesh.instanceMatrix.needsUpdate = true; 
  }
}