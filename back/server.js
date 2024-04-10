import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import { db } from './db.js';

db.init();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },

});

app.get('/', (req, res) => {
  res.send('This is your backend!');
});

io.on('connection', (socket) => {
  console.log('User connected');
  // Send the todos to the connected client
  try {
    const todos = db.get('todos')
    socket.emit('todos', todos);
  }
  catch (err) {
    console.error(err);
  }

  socket.on('add_todo', (todo) => {
    socket.emit('todos', db.add("todos", todo));
  });

  socket.on("get", (key) => {
    socket.emit(key, db.get(key));
  })

  socket.on('delete_todo', (todoId) => {
    socket.emit('todos', db.delete("todos", todoId));
  });

  socket.on('generate_todo_draft', async (todoId) => {
    const todos = await db.generateDraft("todos", todoId)
    socket.emit('todos', todos);
  });

  socket.on('re_generate', async ({ id, inputsObject, action }) => {
    console.log("💭 Regenerating draft!");
    const todos = await db.continueDraft("todos", id, inputsObject, action)
    console.log("Draft generated! ✅");


    socket.emit('todos', todos);
  });

  socket.on('get_todo', async (id) => {
    const todo = await db.getInside("todos", id)
    socket.emit(`todo_${id}`, todo);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Listen on the http server, not the express app
server.listen(port, () => {
  console.log(`Server is running with CORS and Socket.IO at http://localhost:${port}`);
});