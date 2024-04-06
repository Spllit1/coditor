const { spawn } = require('child_process');
const { spawnSync } = require('child_process');
const fs = require('fs');
const { readdir } = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', handleConnection);

function handleConnection(ws) {
    let childProcess;
    let stdinQueue = [];
    ws.on('message', handleMessage);

    function handleMessage(message) {
        const data = JSON.parse(message);
        const { type, payload } = data;

        switch (type) {
            case 'run':
                console.log(`running command: ${payload}`);
                runCommand(payload);
                break;
            case 'stdin':
                handleStdin(payload);
                break;
            case 'create_file':
                handleCreateFile(payload);
                break;
            case 'get_all_content':
                handleGetAllContent();
                break;
            default:
                ws.send(JSON.stringify({ type: 'error', payload: 'Invalid request' }));
                break;
        }
    }

    function runCommand(command) {
        childProcess = spawn(command, [], { shell: true });

        childProcess.stdout.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'stdout', payload: data.toString() }));
        });

        childProcess.stderr.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'stderr', payload: data.toString() }));
        });

        childProcess.on('exit', (code) => {
            ws.send(JSON.stringify({ type: 'exit', payload: code }));
        });

        while (stdinQueue.length > 0) {
            const queuedPayload = stdinQueue.shift();
            childProcess.stdin.write(queuedPayload + '\n');
        }
    }

    function handleStdin(payload) {
        if (childProcess && childProcess.stdin.writable) {
            childProcess.stdin.write(payload + '\n');
        } else {
            stdinQueue.push(payload);
        }
    }

    function handleCreateFile(payload) {
        const { fileName, content } = payload;
        const filePath = `./UserCode/${fileName}`;

        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error(err);
                ws.send(JSON.stringify({ type: 'error', payload: 'Error creating file' }));
            } else {
                ws.send(JSON.stringify({ type: 'success', payload: 'File created successfully' }));
            }
        });
    }

    function handleGetAllContent() {
        const directoryPath = './UserCode';

        readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(err);
                ws.send(JSON.stringify({ type: 'error', payload: 'Error getting directory content' }));
            } else {
                ws.send(JSON.stringify({ type: 'content', payload: files }));
            }
        });
    }
}

console.log('WebSocket server listening on port 3000');
