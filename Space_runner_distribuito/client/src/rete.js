export class Rete {
  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');
    
    this.socket.addEventListener('open', () => {
      console.log('Connesso al server');
      this.invia({ tipo: 'saluto', messaggio: 'ciao dal client' }); //prova
      // mando un ping ogni secondo per misurare l'RTT
      setInterval(() => {
        this.invia({ tipo: 'ping', t: performance.now() });
      }, 1000);
    });

    
   this.socket.addEventListener('message', (evento) => {
  const dati = JSON.parse(evento.data);
  if (dati.tipo === 'benvenuto') {
    this.id = dati.id;
  } else if (dati.tipo === 'stato' && this.onStato) {
    this.onStato(dati);
  } else if (dati.tipo === 'pong') {
    const ora = performance.now();      
    this.rtt = ora - dati.t;            
    if (this.onRtt) this.onRtt(this.rtt);
  }
});

    
    this.socket.addEventListener('close', () => {
      console.log('Connessione chiusa');
    });
  }

 
  invia(oggetto) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(oggetto));
    }
  }
}