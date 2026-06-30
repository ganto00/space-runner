import * as THREE from 'three';


export class Navicella {
  constructor() {
    const geometry = new THREE.ConeGeometry(0.5, 1.5, 16);
    geometry.rotateX(-Math.PI / 2); // ruota il cono in modo che "punti" verso -Z
    const material = new THREE.MeshStandardMaterial({ color: 0x4f9dde, flatShading: true });
    this.mesh = new THREE.Mesh(geometry, material);

    this.speed = 8; // unità al secondo
    this.bounds = { x: 6, y: 3.5 };
    this.input = { left: false, right: false, up: false, down: false };
    this.bindKeys();
  }


  bindKeys() {
  const set = (e, val) => {
    switch (e.code) {
      case 'ArrowLeft':  case 'KeyA': this.input.left = val;  break;
      case 'ArrowRight': case 'KeyD': this.input.right = val; break;
      case 'ArrowUp':    case 'KeyW': this.input.up = val;    break;
      case 'ArrowDown':  case 'KeyS': this.input.down = val;  break;
      default: return;
    }
    e.preventDefault();
    if (this.onInputChange) this.onInputChange(this.input); // notifica il cambiamento
  };
  window.addEventListener('keydown', (e) => set(e, true));
  window.addEventListener('keyup',   (e) => set(e, false));
}


  update(dt) {
    const move = this.speed * dt;
    /*
    if (this.input.left)  this.mesh.position.x -= move;
    if (this.input.right) this.mesh.position.x += move;
    if (this.input.up)    this.mesh.position.y += move;
    if (this.input.down)  this.mesh.position.y -= move;
    */
    //la versione precedente faceva questa operazione nel client mentre ora la fa il server 

    this.mesh.position.x = Math.max(-this.bounds.x, Math.min(this.bounds.x, this.mesh.position.x));
    this.mesh.position.y = Math.max(-this.bounds.y, Math.min(this.bounds.y, this.mesh.position.y));

    //rotazione
    const targetRoll = (this.input.left ? 0.4 : 0) - (this.input.right ? 0.4 : 0);
    this.mesh.rotation.z += (targetRoll - this.mesh.rotation.z) * 0.1;
  }
}