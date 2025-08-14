import { Router } from 'express';
import Service from '../service/service.model.js';
import Product from '../product/product.model.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { q = '', categoryId, subcategoryId, limit = 10 } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (categoryId) filter.categoryId = categoryId;
    if (subcategoryId) filter.subcategoryId = subcategoryId;

    const [services, products] = await Promise.all([
      Service.find(filter).limit(Number(limit)).lean(),
      Product.find(filter).limit(Number(limit)).lean()
    ]);

    res.json({ services, products });
  } catch (e) { next(e); }
});

export default router;
