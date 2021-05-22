const http = require('http');
const PORT = 5000;
const todos =[
  {id:1,tex:'Todo One'},
  {id:2,tex:'Todo Two'},
  {id:3,tex:'Todo Three'},
  {id:4,tex:'Todo Four'}
]
const server = http.createServer((req,res)=>{
  res.writeHead(404,{
    'Content-type':'application/json',
    'X-Powered-By':'Node.js'
  })
  res.end(JSON.stringify({
    success:true,
    error:'Not found',
    data:null
  }));
})

server.listen(PORT,()=>console.log(`Server is running on port ${PORT} `))