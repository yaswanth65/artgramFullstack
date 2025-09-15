import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Product from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', asyncHandler(async (req, res) => {
  const { category, isActive = 'true' } = req.query;
  const filter: any = { isActive: isActive === 'true' };
  if (category) {
    filter.category = category;
  }
  const products = await Product.find(filter).lean();
  
  // Map tags to materials for frontend compatibility
  const mappedProducts = products.map(p => ({
    ...p,
    materials: p.tags || []
  }));
  
  res.json(mappedProducts);
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  // Map tags to materials for frontend compatibility
  const mappedProduct = {
    ...product.toObject(),
    materials: product.tags || []
  };
  
  res.json(mappedProduct);
}));

// Create new product
router.post('/', asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
  media,
    isActive,
    sku,
    weight,
    dimensions,
    tags,
    materials // Accept materials from frontend and map to tags
  } = req.body;

  // Basic request logging for debugging admin product creation
  // (can be removed or gated behind env flag later)
  // eslint-disable-next-line no-console
  console.info('[POST /api/products] request body:', JSON.stringify(req.body));

  // Simple validation
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim() === '') errors.push('name is required');
  if (price === undefined || price === null || typeof price !== 'number' || Number.isNaN(price)) errors.push('price is required and must be a number');
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    media,
    isActive,
    sku,
    weight,
    dimensions,
    tags: tags || materials // Use tags if provided, otherwise use materials
  });

  res.status(201).json(product);
}));

// Update product
router.put('/:id', asyncHandler(async (req, res) => {
  // Handle materials -> tags mapping for updates
  const updateData = { ...req.body };
  if (updateData.materials && !updateData.tags) {
    updateData.tags = updateData.materials;
    delete updateData.materials;
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
}));



export default router;
