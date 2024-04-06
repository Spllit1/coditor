const WebSocket = require('ws');
const readline = require('readline');

// Create a WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
    // Send a message to the server to run a command
    const message = {
      type: 'run',
      payload: 'cd UserCode && node main.js' // replace with your command
    };
    ws.send(JSON.stringify(message));
  });
  
  ws.on('message', function incoming(data) {
    // Handle the server's responses
    const { type, payload } = JSON.parse(data);
  
    switch (type) {
      case 'stdout':
        console.log('Server stdout:', payload);
        break;
      case 'stderr':
        console.error('Server stderr:', payload);
        break;
      case 'exit':
        console.log('Server process exited with code:', payload);
        break;
      case 'error':
        console.error('Server error:', payload);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  });
  
  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
  
  ws.on('close', function close(code) {
    console.log('WebSocket closed with code:', code);
  });
  
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Listen for line events from readline
  rl.on('line', (input) => {
    const message = {
      type: 'stdin',
      payload: input
    };
    ws.send(JSON.stringify(message));
  });