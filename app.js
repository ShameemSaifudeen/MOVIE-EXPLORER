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
import MongoDBStore from 'connect-mongo';

const MongoStore = MongoDBStore.create({
  mongoUrl: 'mongodb+srv://shameemsaifudeen456:123qweasd@cluster0.ys6mrv6.mongodb.net/?retryWrites=true&w=majority'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    store:MongoStore,
    cookie: {
        secure: true, // this may be required if you're dealing with https cookies
        httpOnly: true, // ensures the cookie is sent over HTTP(S) only
        maxAge: 1000 * 60 * 60 * 24 * 7 // sets cookie expiry length (optional)
    }
  }));

connectDB()

app.use(express.static('public'));

app.get('/home', (req, res) => {
    console.log(req.session);
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});
app.get('/',redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});
app.get('/signup',redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/signup.html'));
});

app.use('/', authRoutes);
app.use('/', playlistRoutes);

app.listen(3000, () => console.log('Server Started on port 3000'));
