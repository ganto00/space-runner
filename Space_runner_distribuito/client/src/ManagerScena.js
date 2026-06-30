import * as THREE from 'three';


export class ManagerScena { //render 
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05060a);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //se voglio mettere più cose nello schermo cambia near e far 
    
    this.camera.position.set(0, 4, 7);   // più in alto, così vedi il cono di profilo
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   
    document.body.appendChild(this.renderer.domElement);

    this.aggiungiLuci();
    window.addEventListener('resize', () => this.onResize());
  }

  aggiungiLuci() {
    const sole = new THREE.DirectionalLight(0xffffff, 2);
    sole.position.set(3, 5, 4);
    this.scene.add(sole);
    //luce del sole
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    //luce generale per provare forse la cambio
  }
  add(object) { 
    this.scene.add(object); 
  }
  render() { 
    this.renderer.render(this.scene, this.camera); 
  }
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}