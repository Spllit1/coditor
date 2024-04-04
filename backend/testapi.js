const axios = require('axios');

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
    });