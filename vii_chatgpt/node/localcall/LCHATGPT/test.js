const request = require('request');

const data = {
    "callstr":"你好呀",
    "user":"zwj"
};

request.post({
  url: 'http://127.0.0.1:10915/v1/chatgpt/chatcall',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}, function(error, response, body) {
  console.log(body);
});
