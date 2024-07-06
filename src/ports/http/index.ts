import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Router } from 'express';
import { userRoutes } from './routes/userRoutes';
import { homeRoutes } from './routes/homeRoutes';
import { connectDatabase } from '../../adapters/mongo/connection';
import { Server,Socket } from "socket.io";
import { User } from '../../domain/model/User';
import cors from 'cors';
import { newsRoutes } from './routes/newsRoutes';
import path from "path";
import { conn } from '../../adapters/redis';
 
connectDatabase();

// (async ()=>{
//     console.log("ok")
//     const client = await conn;
//     await client.set('key', 'value');
//     const value = await client.get('key');
// })

const appPort = parseInt(process.env.APP_PORT as string, 10) || 8080;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});
export { io };

const route = Router();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const uploadsDirectory = path.resolve(__dirname, "../../../uploads");

app.use(express.json());
app.use(route);

route.use(homeRoutes);
route.use(userRoutes);
route.use(newsRoutes);

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    }); 
});

app.use('/storage', express.static(uploadsDirectory));

server.listen(appPort, () => console.log(`server running on port ${appPort}`));
