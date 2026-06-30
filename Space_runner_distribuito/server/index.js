import { WebSocketServer } from 'ws';
import { performance } from 'perf_hooks';

const wss= new WebSocketServer({ port: 8080 });
console.log('Server in ascolto su ws://localhost:8080');

const clients = new Set();
let prossimoId = 1;
const N= 200;       //aster. 
const spawnZ= -100;
const despawnZ= 12;
const spread= 14;
const speed= 20;
const asteroidi= [];
const velocitaNavicella = 8;

// misure del tick
let sommaTick = 0;
let contaTick = 0;

//per il loop
const TICK_HZ= 30;
let ultimoTempo = Date.now();

// genera un asteroide (o lo ricicla) assegnandogli posizione e velocità di rotazione
function reset(a, initial = false) {
  a.x= (Math.random() - 0.5) * spread;
  a.y= (Math.random() - 0.5) * spread;
  if (initial){
    a.z= Math.random() * spawnZ;
  } else a.z= spawnZ; 
  //a.z = initial ? Math.random() * spawnZ : spawnZ;
  a.scala= 0.5 + Math.random() * 1.5;
}

for (let i= 0; i < N; i++) { //inizializzo 
  const a= { x: 0, y: 0, z: 0, scala: 1 };
  reset(a, true); 
  asteroidi.push(a);
}



//loop di aggiornamento stato delle cose 
function tick() {

  const t0= performance.now(); 

  const ora= Date.now();
  const dt= (ora - ultimoTempo) / 1000;
  ultimoTempo= ora;

  //movimento delle navicelle dei client 
  const navicelle = [];
  for (const socket of clients) {
    const move= velocitaNavicella * dt;
    const n = socket.navicella;
    if (socket.input.left)  n.x -= move;
    if (socket.input.right) n.x += move;
    if (socket.input.up)    n.y += move;
    if (socket.input.down)  n.y -= move;
    //per non farla uscire dai bordi
    n.x = Math.max(-6, Math.min(6, n.x));
    n.y = Math.max(-3.5, Math.min(3.5, n.y));
    navicelle.push({ id: socket.id, x: n.x, y: n.y }); 
  }

  //muovo gli asteroidi
  for (const a of asteroidi) {
    a.z += speed * dt;
    if (a.z > despawnZ) reset(a);
  }

  //mando lo stato ai client connessi 
  const snapshot = JSON.stringify({ tipo: 'stato', asteroidi, navicelle });
  for (const socket of clients) {
    if (socket.readyState === socket.OPEN) socket.send(snapshot);
  }


  //per i test
  sommaTick += performance.now() - t0;
  contaTick++;

 
  if (contaTick >= 60) {
    const mediaTick = sommaTick / contaTick;
    console.log(`Client: ${clients.size} | tick medio: ${mediaTick.toFixed(2)} ms`);
    sommaTick = 0;
    contaTick = 0;
  }


}

setInterval(tick, 1000 / TICK_HZ);


wss.on('connection', (socket) => {
  clients.add(socket);
  prossimoId++;
  socket.id = prossimoId;                    
  socket.navicella = { x: 0, y: 0 };
  socket.input = { left: false, right: false, up: false, down: false };

  socket.send(JSON.stringify({ tipo: 'benvenuto', id: socket.id }));
  console.log(`Client ${socket.id} connesso. Totale: ${clients.size}`);

  socket.on('message', (data) => {
  const messaggio = JSON.parse(data.toString());
  if (messaggio.tipo === 'input') {
    socket.input = messaggio.input; //comandi delle navicelle
  } else if (messaggio.tipo === 'ping') {
  
    socket.send(JSON.stringify({ tipo: 'pong', t: messaggio.t }));
  }
  });

  socket.on('close', () => {
    clients.delete(socket);
    console.log(`Client ${socket.id} disconnesso. Totale: ${clients.size}`);
  });

});