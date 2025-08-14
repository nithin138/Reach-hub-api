const Category = require('./category.model.js');
const Subcategory = require('../subcategory/subcategory.model.js');

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const listCategories = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';
    const items = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
    res.json(items);
  } catch (e) { next(e); }
};

export const getCategory = async (req, res, next) => {
  try {
    const item = await Category.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] }).lean();
    if (!item) return res.status(404).json({ message: 'Category not found' });
    res.json(item);
  } catch (e) { next(e); }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, sortOrder = 0, isActive = true } = req.body;
    const slug = req.body.slug ? toSlug(req.body.slug) : toSlug(name);
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(409).json({ message: 'Category with same name/slug exists' });

    const created = await Category.create({ name, slug, icon, sortOrder, isActive });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, sortOrder, isActive, slug } = req.body;
    const item = await Category.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!item) return res.status(404).json({ message: 'Category not found' });
    if (name) item.name = name;
    if (slug) item.slug = toSlug(slug);
    if (icon !== undefined) item.icon = icon;
    if (sortOrder !== undefined) item.sortOrder = sortOrder;
    if (isActive !== undefined) item.isActive = isActive;
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

export const removeCategory = async (req, res, next) => {
  try {
    const item = await Category.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!item) return res.status(404).json({ message: 'Category not found' });

    // Optional: prevent delete if subcategories exist
    const subCount = await Subcategory.countDocuments({ categoryId: item._id });
    if (subCount > 0) return res.status(400).json({ message: 'Delete/rehoming subcategories first' });

    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
