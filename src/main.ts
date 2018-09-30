// import * as http from 'http';
//console.log(12315)
//console.log(Base64.encode('adfasdfasdf'));

//CM.initData(cacheData)

// for(var i=0;i<100;i++)
// {
//     var t = new Date().getTime();
//     console.log(PKCounter.getInstance().testCard2({"seed":1521528445,"players":[{"id":1,"team":1,"gameid":"1_10009","head":"18","nick":"5YmD5Z2H5ZCI6JKc","force":7,"type":"2","hp":2,"actionlist":"0#65,0#3,0#64,55#61,230#62,417#76,588#63,703#65,881#1"},{"id":2,"team":2,"gameid":"npc","force":2,"type":1,"hp":3,"head":"13","nick":"5oiY5b25Mg==","actionlist":"1#13,120#12,520#11,840#7"}],"version":1,"type":1,"pktime":1521528506,"result":2,"score":"-1:3"}))
//     console.log(new Date().getTime() - t,PKData.getInstance().actionTime)
// }

     //aaaa();



//====================
// const server = http.createServer(function(request:http.IncomingMessage,response:http.ServerResponse):void{
//     console.log("create6 a server..."+Base64.encode('cai'));
//     response.writeHead(200,{'Content-Type':'text/plain'});
//     response.write('Hello world,we use typescript to develop.');
//     response.end();
// });
//
// server.listen(3002,function(){
//     console.log("Server listening on port 3000");
//     console.log("test...");
// });


// var express = require('I:/Program Files/nodejs/node_modules/express');
// var app = express();
// var http = require('http').Server(app);
// http.listen(3002, function() {
//     console.log('Server running at http://127.0.0.1:8000/');
// });
//
// var io = require('I:/Program Files/nodejs/node_modules/socket.io')(http);
// app.get('/', function(req, res){
//     res.send('<h1>Welcome Realtime Server</h1>');
// });
//
// var socket = io.on("connection" ,function () {
//     console.log("a user disconnect");
// })
//
// socket.on("disconnect", function () {
//     console.log("a user disconnect");
//     io.emit("dis", {
//         user_id: socket.name
//     });
// });
//
// socket.on("message", function (data) {
//     console.log(data);
// });

// socket.on("xiaoxi", function (data) {
//     io.emit("message", data);
// });

var ws = require("nodejs-websocket")

var PKClient = (require('./room/PKClient'));
var PKHall = (require('./room/PKHall'));
var PKServer = (require('./room/PKServer'));


PKHall.getInstance().start();
// PKClient.addClient(1)
// Scream server example: "hi" -> "HI!!!"
//创建一个server
var server = ws.createServer(function (conn) {
    console.log("New connection")
    PKClient.addClient(conn)
    //接受到发送的消息
    conn.on("text", function (str) {
        console.log("Received "+str)
        var data = JSON.parse(str);
        conn.lastTime = Date.now();
        PKServer.getInstance().onDataReceive(data,conn)
        // conn.sendText(str.toUpperCase()+"!!!")
    })
    //关闭时触发的消息
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        PKClient.removeClient(conn)
    })
}).listen(3000)
