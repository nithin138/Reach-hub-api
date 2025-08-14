import Product from './product.model.js';

export const listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, q = '', categoryId, subcategoryId, providerId, minPrice, maxPrice, active } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (categoryId) filter.categoryId = categoryId;
    if (subcategoryId) filter.subcategoryId = subcategoryId;
    if (providerId) filter.providerId = providerId;
    if (active !== undefined) filter.isActive = active === 'true';
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
};

export const getProduct = async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (e) { next(e); }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, currency = 'INR', categoryId, subcategoryId, stockQty = 0, sku, images = [] } = req.body;
    if (!categoryId || !subcategoryId) return res.status(400).json({ message: 'categoryId and subcategoryId are required' });
    const created = await Product.create({
      name, description, price, currency, categoryId, subcategoryId, stockQty, sku, images, providerId: req.user.id
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const item = await Product.findOne({ _id: req.params.id, providerId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Product not found' });
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const item = await Product.findOneAndDelete({ _id: req.params.id, providerId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
