const axios = require('axios');
const fs = require('fs');

/*
const data = {
    key: `
import time
for i in range(10):
    print(i)
    time.sleep(1)
`
};

axios.post('http://localhost:3000/api/run', data)
    .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log('Body: ', res.data);
    }).catch((err) => {
        console.error(err);
    });*/


/*
const fileName = 'test.txt';
const content = 'Hello, woraaaald!';

axios.post('http://localhost:3000/api/create_file', { fileName, content })
    .then((res) => {
        console.log(res.data); // 'File created successfully'
    })
    .catch((error) => {
        console.error(error);
    });*/

/*
axios.post('http://localhost:3000/api/get_all_content')
    .then((res) => {
        console.log(res.data);
    })
    .catch((error) => {
        console.error(error);
    });*/


axios({
    method: 'post',
    url: 'http://localhost:3000/api/run',
    responseType: 'stream'
})
.then(function (response) {
    response.data.on('data', (chunk) => {
        process.stdout.write(chunk);
    });


    response.data.on('end', () => {
        console.log('Stream ended');
    });
})
.catch(function (error) {
    console.error(error);
});
    