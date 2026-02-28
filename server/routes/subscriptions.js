import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Subscriptions route working', data: [] });
});

export default router;
