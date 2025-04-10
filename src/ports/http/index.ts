import express from 'express';
import http from 'http';
import { Router } from 'express';
import { userRoutes } from './routes/userRoutes';
import { homeRoutes } from './routes/homeRoutes';
import { choiceRoutes } from './routes/choiceRoutes';
import { connectDatabase } from '../../adapters/mongo/connection';
import { Server, Socket } from "socket.io";
import { User } from '../../domain/model/User';
import cors from 'cors';
import { newsRoutes } from './routes/newsRoutes';
import path from "path";
import { conn } from '../../adapters/redis';

connectDatabase();

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
route.use('/api/questions', choiceRoutes);

let videoStartTime: number | null = null;
let intervalId: NodeJS.Timeout | null = null;

io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    // Enviar o estado atual do vídeo para o novo cliente
    if (videoStartTime !== null) {
        console.log(`Enviando play-video para novo cliente com startTime: ${videoStartTime}`);
        socket.emit('play-video', { startTime: videoStartTime });
    }

    socket.on('play-video', (data: { startTime: number }) => {
        videoStartTime = data.startTime;
        console.log(`Vídeo iniciado com startTime: ${videoStartTime}`);
        io.emit('play-video', { startTime: videoStartTime });

        if (!intervalId) {
            intervalId = setInterval(() => {
                if (videoStartTime !== null) {
                    const currentTime = (Date.now() - videoStartTime) / 1000;
                    io.emit('video-time-update', { currentTime });
                }
            }, 1000);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use('/storage', express.static(uploadsDirectory));

server.listen(appPort, () => console.log(`server running on port ${appPort}`));