// const express = require('express'); 
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "10mb"})); // to accept json data from client
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});