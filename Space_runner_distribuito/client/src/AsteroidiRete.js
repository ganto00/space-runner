import * as THREE from 'three';

export class AsteroidiRete {
  constructor(capacita = 1000) {
    // geometria e materiale come nell'altra versione
    this.geometry = new THREE.IcosahedronGeometry(0.5, 1);
    this.material= new THREE.MeshStandardMaterial({ color: 0x8a8a8a, flatShading: true });

    
    this.mesh= new THREE.InstancedMesh(this.geometry, this.material, capacita);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count= 0; 

    this.dummy= new THREE.Object3D();
  }

  // prendo lo snap. e aggiorno 
  applicaSnapshot(asteroidi) {
    const n = asteroidi.length;
    for (let i = 0; i < n; i++) {
      const a = asteroidi[i];
      this.dummy.position.set(a.x, a.y, a.z);
      this.dummy.scale.setScalar(a.scala);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.count = n;                        
    this.mesh.instanceMatrix.needsUpdate = true; // notifica la GPU
  }
}