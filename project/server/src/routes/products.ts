import express from 'express';
import asyncHandler from 'express-async-handler';
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
  res.json(products);
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
}));

// Create new product
router.post('/', asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    isActive,
    sku,
    weight,
    dimensions,
    tags
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    isActive,
    sku,
    weight,
    dimensions,
    tags
  });

  res.status(201).json(product);
}));

// Update product
router.put('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
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
