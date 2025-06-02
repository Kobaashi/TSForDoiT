import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

export const db = new PrismaClient()
const app = express();
const PORT = 5000;

dotenv.config();
app.use(cors());
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
