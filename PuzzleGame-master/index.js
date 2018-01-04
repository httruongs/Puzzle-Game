var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

http.listen("3000", "0.0.0.0", 1000000, function(){
    console.log("connected");
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
// app.get('/level2.html', function(req, res){
//     res.sendFile(__dirname + '/level2.html');
// });

app.get('/index.html', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//Use can use the code: 
//app.use(express.static('public'));

var waitingForGame = [];
var games = [];

io.on('connection', function(socket){

    socket.on('play', function(msg){
        console.log(msg);
        for(var i = 0; i < games.length; i++)
        {
            if(games[i].id == msg.id)
            {
                games[i].player1.emit('play', {play: msg.play, player: msg.player });
                games[i].player2.emit('play', {play: msg.play, player: msg.player });
            }
        }

    });


    // socket.on('level2', function(msg){
    //     console.log(msg);
    //     for(var i = 0; i < games.length; i++)
    //     {
    //         if(games[i].id == msg.id)
    //         {
    //             games[i].player1.emit('level2', {});
    //             games[i].player2.emit('level2', {});
    //         }
    //     }

    // });

    
    socket.on('requestGame', function(msg){
        
        waitingForGame.push(socket);

        if(waitingForGame.length >= 2)
        {
            var socket1 = waitingForGame[0];
            waitingForGame.splice(0, 1);
            var socket2 = waitingForGame[0];
            waitingForGame.splice(0, 1);
            
            var game = {
                "player1" : socket1,
                "player2" : socket2,
                "id" : Math.random(),
            }

            games.push(game);

            socket1.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : "X",
            });

            socket2.emit("Start Game", {
                "id" : game.id,
                "playerAssignment" : "O",
            });

        }

    });
    
});


console.log("Still marketing to do.")
