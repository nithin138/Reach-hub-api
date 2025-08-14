import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: 'text' },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    currency: { type: String, default: 'INR' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true, index: true },
    images: [{ url: String, publicId: String }],
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stockQty: { type: Number, default: 0 },
    sku: { type: String, trim: true, index: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
