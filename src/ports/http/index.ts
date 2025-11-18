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

const uploadsDirectory = path.resolve(__dirname, "../../../Uploads");

app.use(express.json());
app.use(route);

route.use(homeRoutes);
route.use(userRoutes);
route.use(newsRoutes);
route.use('/api/questions', choiceRoutes);

// Armazenar o sexo (menino ou menina)
let selectedSex: 'boy' | 'girl' | null = null;

// Rota para cadastrar o sexo
route.post('/api/sex', (req, res) => {
  const { sex } = req.body;
  if (sex !== 'boy' && sex !== 'girl') {
    return res.status(400).json({ error: 'Sexo inválido. Use "boy" ou "girl".' });
  }
  selectedSex = sex;
  console.log(`Sexo cadastrado: ${sex}`);
  io.emit('sex-selected', { sex }); // Notificar clientes
  res.status(200).json({ message: 'Sexo cadastrado com sucesso' });
});

// Rota para obter o sexo atual
route.get('/api/sex', (req, res) => {
  res.status(200).json({ sex: selectedSex });
});

let videoStartTime: number | null = null;
let intervalId: NodeJS.Timeout | null = null;

io.on('connection', (socket: Socket) => {
  console.log(`Usuário conectado, ID: ${socket.id}, Total de conexões: ${io.engine.clientsCount}`);

  // Enviar o sexo atual para o novo cliente
  if (selectedSex !== null) {
    socket.emit('sex-selected', { sex: selectedSex });
  }

  // Enviar estado do vídeo para o novo cliente
  if (videoStartTime !== null) {
    console.log(`Enviando play-video para cliente ${socket.id} com startTime: ${videoStartTime}`);
    socket.emit('play-video', { startTime: videoStartTime });
  }

  socket.on('play-video', (data: { startTime: number }) => {
    if (selectedSex === null) {
      console.log('Tentativa de iniciar vídeo sem sexo cadastrado');
      socket.emit('error', { message: 'Cadastre o sexo antes de iniciar o vídeo' });
      return;
    }
    if (videoStartTime !== null) {
      console.log('Vídeo já iniciado, ignorando nova tentativa');
      return; // Evita reemissões
    }
    videoStartTime = data.startTime;
    console.log(`Vídeo iniciado com startTime: ${videoStartTime}`);
    io.emit('play-video', { startTime: videoStartTime, sex: selectedSex });
  
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
    console.log(`Usuário desconectado, ID: ${socket.id}, Total de conexões: ${io.engine.clientsCount}`);
  });
});

app.use('/storage', express.static(uploadsDirectory));

server.listen(appPort, () => console.log(`Servidor rodando na porta ${appPort}`));