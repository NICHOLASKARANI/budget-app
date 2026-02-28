import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Goals route working', data: [] });
});

export default router;
