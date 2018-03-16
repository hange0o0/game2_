import * as http from 'http';
console.log(12315)
console.log(Base64.encode('adfasdfasdf'));

CM.initData(cacheData)

for(var i=0;i<100;i++)
{
    var t = new Date().getTime();
    PKCounter.getInstance().testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1')
    console.log(new Date().getTime() - t)
}





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

