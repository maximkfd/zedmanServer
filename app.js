var express = require('express');

var app = express();

var players = [];


var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log("User connected");
    players.push(new player(socket.id, 64, 400));
    console.log(players);


    socket.emit("SocketID", { id: socket.id });
    socket.broadcast.emit('newPlayer', { id: socket.id });

    socket.emit("getPlayers", players);

    socket.on('disconnect', function(){
        console.log("User disconnected");
        socket.emit('playerLeft', { id: socket.id });
        socket.broadcast.emit('playerLeft', { id: socket.id });
        for (var i = 0; i < players.length; i++){
            if (socket.id == players[i].id){
                players.splice(i, 1);
            }
        }
    });
    socket.on("bulletCreated", function(data){
        data.id = socket.id;
        socket.broadcast.emit('bulletCreated', data);
    });

    //2.3311417 : 2.5149996
    socket.on("playerMoved", function(data){
        data.id = socket.id;
        socket.broadcast.emit('playerMoved', data);
        for (var i = 0; i< players.length; i++){
            if (data.id == players[i].id){
                players[i].x = data.x;
                players[i].y = data.y;
            }
        }
        //var j = 0;
        //do{
        //    j++
        //} while (data.id != players[j].id);
        //players[j].x = data.x;
        //players[j].y = data.y;
        //console.log(i + " : " + players[i] + " : " + players[0] + " : " + players + " : " + players.length + " : " + data);
        console.log("PlayerMoved" + data.y + data.x);
    });

});

server.listen(1488);

var player = function(id, x, y){
    this.id = id;
    this.x = x;
    this.y = y;

};
module.exports = app;
