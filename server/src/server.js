require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const resultRoutes = require('./routes/resultRoutes');
const { authMiddleware, roleMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);

// ✅ Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId,
    role: req.userRole
  });
});

// ✅ Admin only route
app.get('/api/admin-only',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});