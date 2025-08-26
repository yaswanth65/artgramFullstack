import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branches';
import orderRoutes from './routes/orders';
import bookingRoutes from './routes/bookings';
import productRoutes from './routes/products';
import sessionRoutes from './routes/sessions';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com', 'https://craft-factory.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth specific rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

app.get('/api/health', (req, res) => res.json({ok: true, timestamp: new Date().toISOString()}));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
