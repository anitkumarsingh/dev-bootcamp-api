const http = require('http');
const PORT = 5000;
const server = http.createServer((req,res)=>{
  const {headers,methods} =req;
  console.log(headers,methods)
  res.end();
})

server.listen(PORT,()=>console.log(`Server is running on port ${PORT} `))