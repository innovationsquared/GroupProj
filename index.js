//This is a simple backend server.
const express = require('express');
const app = express();
const PORT = 8000;
const fs = require('fs');
const csv = require('csv-parser');

let data = {};
fs.createReadStream('./data/github_dataset.csv')
  .pipe(csv())
  .on('data', (row) => {
    const key = row[Object.keys(row)[0]]; // First column as key
    data[key] = row;
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
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
