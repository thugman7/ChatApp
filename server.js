const path = require('path');
const http=require('http');
const express =require('express');
const socketio= require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');


const app=express();
const server=http.createServer(app);
const io=socketio(server);

//Setting static folder.
app.use(express.static(path.join(__dirname,'public')));

const botName='ChatterBot'

//Run when client connects
io.on('connection',socket => {
    //console.log('New WS connection...');
  socket.on('joinRoom',({username,room})=>{

  const user=userJoin(socket.id,username,room);

    socket.join(user.room);

    //Welcome Current User
    socket.emit('message',formatMessage(botName,'Welcome to ChatCord'));

    
    //Broadcast when user connects
    socket.broadcast.to(user.room).emit('message',
    formatMessage(botName,`${user.username} has joined the chat`));
    //socket.emit('message','Welcome to ChatCord');//Emits to single client thats connecting.

    //broadcast when a user connects()[Emits to evrybody except the user thats emitting]
    //socket.broadcast.emit('message',formatMessage(botName,'User has joined'));

    //Send users and room info.
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)//Sending an object of room and users in that room when a user joins a room.
    })

   });

    

    //Runs when client disconnects
    socket.on('disconnect',()=>{
      const user=userLeave(socket.id);
      if(user)
      {
          io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));//Emits to everyone.
          //Send users and room info.
          io.to(user.room).emit('roomUsers',{
          room:user.room,
          users:getRoomUsers(user.room)//Sending an object of room and users in that room when a user joins a room.
          })  
      }
    }); 

    //Listen for chatMessage
    socket.on('chatMessage',msg=>{
      const user=getCurrentUser(socket.id);

      io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
});

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>console.log(`Server running in Port ${PORT}`));