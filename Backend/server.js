import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

export const db = new PrismaClient()
const app = express();
const PORT = process.env.PORT;

dotenv.config();
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

async function startServer() {
  try {
    await db.$connect();
    console.log('PostgreSQL database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  }
}

startServer();

app.get('/', (req, res) => {
  res.send('Backend server is running');
})

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
