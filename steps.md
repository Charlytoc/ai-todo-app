# Steps I followed to make the repository

1. Run:

```bash
npm init -y
```

2. Install the following packages:

```bash
npm install express
```

3. Create a file named `server.ts` and write the following code:

```javascript
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

4. Run the server:

```bash
node server.js
```

5. Open the browser and go to `http://localhost:3000/` to see the message `Hello World!`.

6. Change the type in the package.json file to `module:

```json
{
  "type": "module"
}
```

7. Add basic socket io server code in the server.js file:

```javascript
import express from 'express';
import cors from 'cors';
import { Server as SocketIO } from 'socket.io';
import http from 'http';

const app = express();
const port = 3000; // Try a different port if 3000 is in use

app.use(cors());

// Create a new http server and pass the express app as the handler
const server = http.createServer(app);

// Attach socket.io to the http server
const io = new SocketIO(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    // Handle message logic here
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Listen on the http server, not the express app
server.listen(port, () => {
  console.log(`Server is running with CORS and Socket.IO at http://localhost:${port}`);
});
```

8. Init the frontend with Vite:

```bash
npm init vite@latest front
```