const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const ivrRoutes = require('./routes/ivrRoutes');
const smsRoutes = require('./routes/smsRoutes');
const gisRoutes = require('./routes/gisRoutes');
const officerRoutes = require('./routes/officerRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const riskRoutes = require('./routes/riskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const configRoutes = require('./routes/configRoutes');
const { getHelplineConfig } = require('./config/helpline');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ivr', ivrRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/gis', gisRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/config', configRoutes);

// Root & Healthcheck
app.get('/api/health', (req, res) => {
  const helpline = getHelplineConfig();
  res.json({
    status: 'HEALTHY',
    system: 'KrishiRakshak AI Early Warning System',
    helpline: `${helpline.name}: ${helpline.number}`,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('KrishiRakshak REST API Server Running. Navigate to /api/health for system status.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` KrishiRakshak Backend API Server Started on Port ${PORT}`);
  console.log(` Active Helpline: ${getHelplineConfig().name} (${getHelplineConfig().number})`);
  console.log(` Supported Languages: English, हिन्दी (Hindi), मराठी (Marathi)`);
  console.log(`=======================================================`);
});
