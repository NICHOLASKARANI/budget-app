import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Expenses route working', data: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'Expense created', data: req.body });
});

export default router;
