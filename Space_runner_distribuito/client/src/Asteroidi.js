import * as THREE from 'three';

export class Asteroidi {
  constructor(n=500) {
    this.n = n; 
    this.asteroidi = [];
    this.group = new THREE.Group(); 

    this.geometry = new THREE.IcosahedronGeometry(0.5, 1); 
    this.material = new THREE.MeshStandardMaterial({ color: 0x8a8a8a, flatShading: true });

    this.spawnZ = -100;  // nascono in profondità (−Z)
    this.despawnZ = 12;  // superata la camera si riciclano
    this.spread = 14;    // ampiezza del campo su X e Y
    this.speed = 20;     // velocità verso di me

    this.createAsteroids();
  }

  createAsteroids() {
    for (let i= 0; i < this.n; i++) {
      const mesh= new THREE.Mesh(this.geometry, this.material);
      this.reset(mesh, true);
      // ogni asteroide ruota a modo suo, per varietà
      mesh.userData.spin = {
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.03,
      };
      this.asteroidi.push(mesh);
      this.group.add(mesh);
    }
  }

  // posiziona un asteroide all'avvio sparso in profondità, al riciclo in fondo
  reset(mesh, initial = false) {
    mesh.position.x = (Math.random() - 0.5) * this.spread;
    mesh.position.y = (Math.random() - 0.5) * this.spread;
    if(initial){
        mesh.position.z = Math.random() * this.spawnZ;
    } else mesh.position.z = this.spawnZ;
    
    const s = 0.5 + Math.random() * 1.5; // dimensione casuale
    mesh.scale.set(s, s, s);
  }
  update(dt) {
    const move = this.speed * dt;
    for (const mesh of this.asteroidi) {
      mesh.position.z += move;            
      mesh.rotation.x += mesh.userData.spin.x;
      mesh.rotation.y += mesh.userData.spin.y;
      if (mesh.position.z > this.despawnZ) this.reset(mesh); // riciclo
    }
  }
}