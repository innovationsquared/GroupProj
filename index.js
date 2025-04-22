//This is a simple backend server.
const express = require('express');
const app = express();
const PORT = 8000;
const data = require('./data/github_dataset.csv');
console.log(data);

app.use(express.static('public'));
//app.use('/tree.js', express.static('tree.js'));

app.get('/start', (req, res)=>{
  res.send(Object.keys(data));
});

app.listen(PORT, ()=> {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/',(req,res)=> {
res.send("Hello, Server!");
});

app.get('/data', (req, res)=> {
  //const name = data[req.query.k];
  //const tree = data[name];
  const key = req.query.key
  res.send(data[key]);
});

//app.post
