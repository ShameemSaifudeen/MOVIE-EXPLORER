import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectDB from './database/dbconnection.js';
import isAuthenticated from './middleware/auth.js';
import {redirectIfAuthenticated} from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import playlistRoutes from './routes/playlist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: "key", resave: true, saveUninitialized: true, cookie: { maxAge: 600000 } }))

connectDB()

app.use(express.static('public'));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});
app.get('/signup',redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/signup.html'));
});

app.use('/', authRoutes);
app.use('/', playlistRoutes);

app.listen(3000, () => console.log('Server Started on port 3000'));
