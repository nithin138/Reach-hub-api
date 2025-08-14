import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

subcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });
subcategorySchema.index({ slug: 1, categoryId: 1 }, { unique: true });

export default mongoose.model('Subcategory', subcategorySchema);
