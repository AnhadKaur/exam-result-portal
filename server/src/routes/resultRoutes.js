const express = require('express');
const {
  getResults,
  getMyResults,
  addResult,
  updateResult,
  deleteResult,
  getResultsStats
} = require('../controllers/resultController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes accessible by authenticated users
router.get('/my-results', authMiddleware, getMyResults);
router.get('/stats', authMiddleware, getResultsStats);

// Admin and Faculty routes
router.get('/', authMiddleware, roleMiddleware(['faculty', 'admin']), getResults);
router.post('/', authMiddleware, roleMiddleware(['faculty', 'admin']), addResult);
router.put('/:id', authMiddleware, roleMiddleware(['faculty', 'admin']), updateResult);
router.delete('/:id', authMiddleware, roleMiddleware(['faculty', 'admin']), deleteResult);

module.exports = router;
