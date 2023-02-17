const http = require('http');

const url = 'http://127.0.0.1:10915/v1/chatgpt/';

http.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(json);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
