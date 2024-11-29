import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import itemRoutes from './routes/items';

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/api/items', itemRoutes);

app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

export default app;
