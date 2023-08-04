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
import MongoDBStoreFactory from 'connect-mongodb-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const MongoDBStore = MongoDBStoreFactory(session);

const store = new MongoDBStore({
  uri: 'mongodb+srv://shameemsaifudeen456:123qweasd@cluster0.ys6mrv6.mongodb.net/?retryWrites=true&w=majority',
  collection: 'yourSessionCollection'
});

store.on('error', function(error) {
  console.log(error);
});
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  }));

connectDB()

app.use(express.static('public'));

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});
app.get('/login',redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});
app.get('/signup',redirectIfAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/signup.html'));
});

app.use('/', authRoutes);
app.use('/', playlistRoutes);

app.listen(3000, () => console.log('Server Started on port 3000'));
