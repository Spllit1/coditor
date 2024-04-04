const { spawn } = require('child_process');
const express = require('express')
const app = express()
app.use(express.json());
const port = 3000




app.post('/api/run', (req, res) => {
    console.clear();
    const body = req.body;
    // run user code object
    const rucobject = spawn('python', ['-u','-c', body.key]);
    res.send(`Api recieved: ${JSON.stringify(body.key)}`);
    console.log(`Running user code object: ${body.key}`)
    rucobject.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    
    rucobject.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    rucobject.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})