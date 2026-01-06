import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import 'express-async-errors';

// Import routes
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the frontend UI directory
const frontendPath = path.join(__dirname, '../../UI');
app.use(express.static(frontendPath));
console.log(`📁 Serving static files from: ${frontendPath}`);

// Health check
app.get('/health', (req, res) => {
    console.log('📡 Health check requested from:', req.ip || req.connection.remoteAddress);
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        backend: 'Infinium Backend API',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/food', foodRoutes);
app.use('/api/users', userRoutes);

// ESP32 Image Upload Endpoint
app.post('/api/esp32/upload', async (req, res) => {
    try {
        const { imageBuffer, imageUrl, userId } = req.body;
        
        if (!imageBuffer && !imageUrl) {
            return res.status(400).json({
                success: false,
                error: 'Either imageBuffer or imageUrl is required'
            });
        }
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }
        
        // Call the upload and analyze function
        const { uploadAndAnalyzeFood } = await import('./controllers/foodController.js');
        
        // Manually set up req.params and req.body for the controller
        req.params.userId = userId;
        
        await uploadAndAnalyzeFood(req, res);
    } catch (error) {
        console.error('Error in ESP32 upload:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Serve index.html for all non-API routes (client-side routing)
// But exclude API routes and health check
app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
        res.status(404).json({
            success: false,
            error: 'Route not found'
        });
    } else {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

// 404 handler (for API routes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Infinium Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'all origins'}`);
});

export default app;
