const mongoose= require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true, index: true },
    location: { type: String, required: true, index: true },
    images: [{ url: String, publicId: String }],
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

serviceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
