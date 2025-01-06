import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://jade-meringue-d415f7.netlify.app',
  'https://pledgewise-uganda.netlify.app',
  'https://pledgecard.gepfinance.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Netlify preview deployments
    if (origin.endsWith('netlify.app')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowedOrigins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../public_html')));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Campaign endpoints
app.post('/api/campaigns', async (req, res) => {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        ...req.body,
        currentAmount: 0,
      },
    });
    res.json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Error creating campaign', details: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    console.log('Attempting to fetch campaigns from database...');
    // First try a simple query without relations
    const campaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        title: true,
        code: true,
        description: true,
        targetAmount: true,
        currentAmount: true,
        organizerName: true,
        organizerContact: true,
        location: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            contributions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Successfully fetched campaigns:', campaigns.length);
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ 
      error: 'Failed to fetch campaigns',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: { id: id },
      include: {
        contributions: true
      }
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Update campaign endpoint
app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetAmount, category, location, imageUrl } = req.body;
    
    const campaign = await prisma.campaign.update({
      where: { id: id },
      data: {
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        category,
        location,
        imageUrl
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Contribution endpoints
app.post('/api/campaigns/:id/contribute', async (req, res) => {
  try {
    const { amount, name, email, phoneNumber, message } = req.body;
    const campaignId = req.params.id;

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the contribution
      const contribution = await prisma.contribution.create({
        data: {
          amount: Number(amount),
          name,
          email,
          phoneNumber,
          message,
          campaignId,
        },
      });

      // Update the campaign's current amount
      const campaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          currentAmount: {
            increment: Number(amount)
          }
        },
        include: {
          contributions: true
        }
      });

      return { contribution, campaign };
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ error: 'Error creating contribution', details: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/api/contributions', async (req, res) => {
  try {
    const contributions = await prisma.contribution.findMany({
      include: {
        campaign: {
          select: {
            title: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(contributions);
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({ error: 'Error fetching contributions', details: error instanceof Error ? error.message : String(error) });
  }
});

// Pledges endpoints
app.post('/api/pledges', async (req, res) => {
  try {
    const pledge = await prisma.pledge.create({
      data: req.body,
    });
    res.json(pledge);
  } catch (error) {
    console.error('Error creating pledge:', error);
    res.status(500).json({ error: 'Error creating pledge', details: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/api/pledges', async (req, res) => {
  try {
    const pledges = await prisma.pledge.findMany();
    res.json(pledges);
  } catch (error) {
    console.error('Error fetching pledges:', error);
    res.status(500).json({ error: 'Error fetching pledges', details: error instanceof Error ? error.message : String(error) });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories', details: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });
    res.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Error creating category', details: error instanceof Error ? error.message : String(error) });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error deleting category', details: error instanceof Error ? error.message : String(error) });
  }
});

// Locations endpoints
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Error fetching locations', details: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    const { name, description } = req.body;
    const location = await prisma.location.create({
      data: {
        name,
        description
      }
    });
    res.json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Error creating location', details: error instanceof Error ? error.message : String(error) });
  }
});

app.delete('/api/locations/:id', async (req, res) => {
  try {
    await prisma.location.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Error deleting location', details: error instanceof Error ? error.message : String(error) });
  }
});

// User endpoints
app.post('/api/users/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user', details: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users', details: error instanceof Error ? error.message : String(error) });
  }
});

// Add Prisma error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Global error handler caught:', error);
  if (error?.code === 'P2002') {
    res.status(400).json({ error: 'Unique constraint violation' });
  } else if (error?.code?.startsWith('P')) {
    res.status(500).json({ error: 'Database error', details: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../public_html/index.html'));
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
