import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reports route working', data: [] });
});

export default router;
