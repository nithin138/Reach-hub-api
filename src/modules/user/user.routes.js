const { Router } = require('express');
const { protect } = require('../../middlewares/authMiddleware.js');

const router = Router();

router.get('/me', protect, (req, res) => res.json({ id: req.user.id, role: req.user.role }));

module.exports = router;
