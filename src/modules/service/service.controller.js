const Service = require('./service.model.js');
const cloudinary = require('../../config/cloudinary.js');

export const listServices = async (req, res, next) => {
  try {
const { page = 1, limit = 12, q = '', categoryId, subcategoryId, location, minPrice, maxPrice } = req.query;
const filter = {};
if (q) filter.$text = { $search: q };
if (categoryId) filter.categoryId = categoryId;
if (subcategoryId) filter.subcategoryId = subcategoryId;
if (location) filter.location = location;
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Service.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
};

export const getService = async (req, res, next) => {
  try {
    const svc = await Service.findById(req.params.id).lean();
    if (!svc) return res.status(404).json({ message: 'Service not found' });
    res.json(svc);
  } catch (e) { next(e); }
};

export const createService = async (req, res, next) => {
  try {
const { title, description, price, categoryId, subcategoryId, location } = req.body;
// validate presence:
if (!categoryId || !subcategoryId) return res.status(400).json({ message: 'categoryId and subcategoryId are required' });
   const images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload_stream({ folder: 'services' }, () => {});
        // Since we used memoryStorage, use promise wrapper:
      }
    }
    // Simpler: accept URLs for now; Cloudinary wiring can be added later
  const svc = await Service.create({
  title, description, price, categoryId, subcategoryId, location,
  images: req.body.images || [],
  providerId: req.user.id
}); 
    res.status(201).json(svc);
  } catch (e) { next(e); }
};

export const updateService = async (req, res, next) => {
  try {
    const svc = await Service.findOne({ _id: req.params.id, providerId: req.user.id });
    if (!svc) return res.status(404).json({ message: 'Not found' });
    Object.assign(svc, req.body);
    await svc.save();
    res.json(svc);
  } catch (e) { next(e); }
};

export const deleteService = async (req, res, next) => {
  try {
    const svc = await Service.findOneAndDelete({ _id: req.params.id, providerId: req.user.id });
    if (!svc) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
