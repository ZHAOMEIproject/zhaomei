const axios = require('axios');

main()
async function main(){
    let a = await axios.post('http://127.0.0.1:3000/path', {
        key1: 'value1',
        key2: 'value2'
      })
    console.log(a.data);
}