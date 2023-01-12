const axios = require('axios');

axios.post('http://www.example.com/path', {
    key1: 'value1',
    key2: 'value2'
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
