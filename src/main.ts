import * as http from 'http';
console.log(12315)
console.log(Base64.encode('adfasdfasdf'));

//====================
const server = http.createServer(function(request:http.IncomingMessage,response:http.ServerResponse):void{
    console.log("create6 a server..."+Base64.encode('cai'));
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write('Hello world,we use typescript to develop.');
    response.end();
});

server.listen(3002,function(){
    console.log("Server listening on port 3000");
    console.log("test...");
});

