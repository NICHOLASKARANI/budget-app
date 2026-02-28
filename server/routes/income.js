import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Income route working', data: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'Income created', data: req.body });
});

export default router;
