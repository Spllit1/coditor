const { spawn } = require('child_process');
const { spawnSync } = require('child_process');

const express = require('express')
const fs = require('fs');
const { readdir } = require('fs');

const app = express()
app.use(express.json());
const port = 3000

app.post('/api/run', (req, res) => {
    console.clear();
    const command = fs.readFileSync('./run.txt', 'utf8');
    console.log('command:', command);
    const childProcess = spawn(command, [], { shell: true});
    childProcess.stdout.setEncoding('utf-8');

    process.stdin.pipe(childProcess.stdin);


    childProcess.stdout.on('data', (chunk) => {
        console.log('stdout chunk:', chunk);
    });

    childProcess.stderr.on('data', (chunk) => {
        console.error(`stderr: ${chunk}`);
    });


    childProcess.on('exit', (code, signal) => {
        console.log('Process exited with code:', code);
    });

    // Handle process error
    childProcess.on('error', (err) => {
        console.error('Error executing command:', err);
    });
});


app.post('/api/create_file', (req, res) => {
    const { fileName, content } = req.body;
    const filePath = `./UserCode/${fileName}`;

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating file');
        } else {
            res.send('File created successfully');
        }
    });
});

app.post('/api/get_all_content', (req, res) => {
    const directoryPath = './UserCode';

    readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error getting directory content');
        } else {
            res.send(files);
        }
    });
});

app.post('/api/get_directory_content', (req, res) => {
    // TODO: implement this endpoint
})

app.post('/api/get_file_content', (req, res) => {

})

app.post('/api/modify_run_script', (req, res) => {

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})