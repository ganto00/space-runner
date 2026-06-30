import { WebSocket } from 'ws';

// quanti bot lanciare: lo leggiamo dalla riga di comando, default 1
const N = parseInt(process.argv[2]) || 1;
console.log(`Avvio di ${N} bot....`);

// crea un singolo bot
function creaBot(indice) {
  const socket = new WebSocket('ws://localhost:8080');

  socket.on('open', () => {
    // ogni mezzo secondo manda un input casuale
    setInterval(() => {
      const input = {
        left:  Math.random() < 0.5,
        right: Math.random() < 0.5,
        up:    Math.random() < 0.5,
        down:  Math.random() < 0.5,
      };
      socket.send(JSON.stringify({ tipo: 'input', input }));
    }, 500);
  });

  socket.on('message', () => {}); 
  socket.on('error', (err) => console.log(`Bot ${indice} errore:`, err.message));
}

// lancia N bot
for (let i= 0; i < N; i++) {
  creaBot(i);
}

console.log(`${N} bot avviati.`);