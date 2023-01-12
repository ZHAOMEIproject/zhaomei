const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/path', (req, res) => {
  console.log(req.body);
  res.send('Received POST request.');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
