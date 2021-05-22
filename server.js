const http = require('http');
const PORT = 5000;
const todos =[
  {id:1,tex:'Todo One'},
  {id:2,tex:'Todo Two'},
  {id:3,tex:'Todo Three'},
  {id:4,tex:'Todo Four'}
]
const server = http.createServer((req,res)=>{
 const {method,url} = req;
 const {authorization} = req.headers
 console.log(authorization)
 let status =404;
 let response ={
   success:false,
   data:null
 }

 let body =[];
 req.on('data',chunk=>{
   body.push(chunk);
 }).on('end',()=>{
   body =Buffer.concat(body).toString();
   if(method ==='GET' && url==='/todos'){
     status=200;
     response.success=true;
     response.data=todos
   }else if(method ==='POST' && url ==='/todos'){
     const {id,text} = JSON.parse(body);
     if(!id || !text){
       status = 400;
       response.success=false;
       response.data=null
     }else{
      todos.push({id,text});
      status =201;
      response.success =true;
      response.data = todos
     }
   
   }
   res.writeHead(status,{
    'Content-type':'application/json',
    'X-Powered-By':'Node.js'
  })
  res.end(JSON.stringify(response));
 })
 
})

server.listen(PORT,()=>console.log(`Server is running on port ${PORT} `))