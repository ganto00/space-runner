import './style.css';
import * as THREE from 'three';
import { ManagerScena } from './ManagerScena.js';
import { Navicella } from './Navicella.js';
import { Misure } from './Misure.js';

import { Asteroidi } from './Asteroidi.js';   //senza In 
import { AsteroidiInstanced } from './AsteroidiInstanced.js';  //senza LOD
import { AsteroidiLOD } from './AsteroidiLOD.js'; //con entrambi

import { Rete } from './Rete.js';
import { AsteroidiRete } from './AsteroidiRete.js';


const managerScena = new ManagerScena();  
const navicella = new Navicella();
//const asteroidi = new Asteroidi(500);   //senza In
//const asteroidi = new AsteroidiInstanced(500); // senza LOD
//const asteroidi = new AsteroidiLOD(100000);
const asteroidi = new AsteroidiRete();


managerScena.add(navicella.mesh); 
//managerScena.add(asteroidi.group);  //senza In
//managerScena.add(asteroidi.mesh);   //senza LOD
//managerScena.add(asteroidi.group);   
managerScena.add(asteroidi.mesh);  //multiutente
      
const misure = new Misure(managerScena.renderer);
const clock = new THREE.Clock();

//distribuita 
const rete = new Rete();
const altreNavicelle = new Map(); 

rete.onStato = (stato) => {
  asteroidi.applicaSnapshot(stato.asteroidi);

  const idTot = new Set();

  for (const nav of stato.navicelle) {
    idTot.add(nav.id);

    if (nav.id === rete.id) {
      navicella.mesh.position.set(nav.x, nav.y, 0);
    } else {
      // altro giocatore
      let mesh = altreNavicelle.get(nav.id);
      if (!mesh) {
        // prima volta che vedo questo giocatore gli creo una mesh
        mesh = navicella.mesh.clone();
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xdd5f4f }); // rossa, possib. impl. cambiare colore per ogni utente
        managerScena.add(mesh);
        altreNavicelle.set(nav.id, mesh);
      }
      mesh.position.set(nav.x, nav.y, 0);
    }
  }

  // rimuovo le mesh dei giocatori disconnessi 
  for (const [id, mesh] of altreNavicelle) {
    if (!idTot.has(id)) {
      managerScena.scene.remove(mesh);
      altreNavicelle.delete(id);
    }
  }
};
navicella.onInputChange = (input) => {
  rete.invia({ tipo: 'input', input: input });
};
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  navicella.update(dt); 
  //asteroidi.update(dt);      
 // misure.beginFrame();      // start cronometro
  managerScena.render();
  //misure.endFrame(dt);      // stop cronometro + aggiorna display        
  //MISURAZIONI PER PARTE RENDERING     
}
animate();

// piccolo overlay per l'RTT
const rttDiv = document.createElement('div');
rttDiv.style.cssText = `
  position: fixed; top: 10px; right: 10px;
  font-family: monospace; color: #ffcc00;
  background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 6px; white-space: pre;`;
document.body.appendChild(rttDiv);

let valori = [];

rete.onRtt = (rtt) => {
  valori.push(rtt);
  // ogni 3 campioni (~3 secondi) mostra media e max, poi azzera
  if (valori.length >= 3) {

    let somma = 0;
    let max = 0;
    for (const v of valori) {
      somma = somma + v;
      if (v > max) max = v;
    }
    const media = somma / valori.length;
    rttDiv.textContent = `RTT medio: ${media.toFixed(1)} ms\nRTT max: ${max.toFixed(1)} ms`;
    valori = [];
  }
};


