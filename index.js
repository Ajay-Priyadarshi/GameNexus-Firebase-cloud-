import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import planRoutes from './src/routes/planRoutes.js';
import userAnalyticsRoutes from './src/routes/userAnalyticsRoutes.js';
import postAnalyticsRoutes from './src/routes/postAnalyticsRoutes.js';
import salesAnalyticsRoutes from './src/routes/salesAnalyticsRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import likeRoutes from './src/routes/likeRoutes.js';
import followRoutes from './src/routes/followRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import feedRoutes from './src/routes/feedRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import pdfRoutes from './src/routes/pdfRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//Local server connection string
// mongoose.connect("mongodb://127.0.0.1:27017/GameNexus").then(() => {
//   console.log("mongodb connected locally");
// });

//Atlas cloud connection string
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("mongodb connected Atlas cloud");
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/profile', express.static(path.join(__dirname, 'static')));
app.use('/auth', express.static(path.join(__dirname, 'static')));
app.use('/managePlans', express.static(path.join(__dirname, 'static')));
app.use('/userAnalytics', express.static(path.join(__dirname, 'static')));
app.use('/postAnalytics', express.static(path.join(__dirname, 'static')));
app.use('/salesAnalytics', express.static(path.join(__dirname, 'static')));
app.use('/chat', express.static(path.join(__dirname, 'static')));
app.use('/post', express.static(path.join(__dirname, 'static')));
app.use('/events', express.static(path.join(__dirname, 'static')));
app.use('/comment', express.static(path.join(__dirname, 'static')));
app.use('/pdf', express.static(path.join(__dirname, 'static')));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'uploads', filename));
});

// Set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);
app.use('/managePlans', planRoutes);
app.use('/userAnalytics', userAnalyticsRoutes);
app.use('/postAnalytics', postAnalyticsRoutes);
app.use('/salesAnalytics', salesAnalyticsRoutes);
app.use('/chat', chatRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);
app.use('/follow', followRoutes);
app.use('/events', eventRoutes);
app.use('/feed', feedRoutes);
app.use('/comment', commentRoutes);
app.use('/pdf', pdfRoutes);
app.use('/payment', paymentRoutes);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});