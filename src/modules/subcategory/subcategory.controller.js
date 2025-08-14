const Subcategory = require('./subcategory.model.js');
const Category = require('../category/category.model.js');

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const listSubcategories = async (req, res, next) => {
  try {
    const { categoryId, active } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (active !== undefined) filter.isActive = active === 'true';
    const items = await Subcategory.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
    res.json(items);
  } catch (e) { next(e); }
};

export const getSubcategory = async (req, res, next) => {
  try {
    const item = await Subcategory.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(item);
  } catch (e) { next(e); }
};

export const listByCategorySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const items = await Subcategory.find({ categoryId: category._id, isActive: true }).sort({ sortOrder: 1 }).lean();
    res.json(items);
  } catch (e) { next(e); }
};

export const createSubcategory = async (req, res, next) => {
  try {
    const { name, categoryId, sortOrder = 0, isActive = true } = req.body;
    const slug = req.body.slug ? toSlug(req.body.slug) : toSlug(name);
    const exists = await Subcategory.findOne({ $or: [{ name, categoryId }, { slug, categoryId }] });
    if (exists) return res.status(409).json({ message: 'Subcategory with same name/slug exists in this category' });

    const created = await Subcategory.create({ name, slug, categoryId, sortOrder, isActive });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const updateSubcategory = async (req, res, next) => {
  try {
    const { name, slug, sortOrder, isActive } = req.body;
    const item = await Subcategory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Subcategory not found' });
    if (name) item.name = name;
    if (slug) item.slug = toSlug(slug);
    if (sortOrder !== undefined) item.sortOrder = sortOrder;
    if (isActive !== undefined) item.isActive = isActive;
    await item.save();
    res.json(item);
  } catch (e) { next(e); }
};

export const removeSubcategory = async (req, res, next) => {
  try {
    const item = await Subcategory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Subcategory not found' });
    await item.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
