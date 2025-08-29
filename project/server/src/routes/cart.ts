import express from 'express';
import User, { CartItem } from '../models/User';
import Product from '../models/Product';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('cart');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ cart: user.cart || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { productId, title, price, qty = 1, image } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Missing required fields: productId is required' });
    }

    // If title or price missing, look up product details server-side
    let finalTitle = title;
    let finalPrice = price;
    let finalImage = image;

    if (!finalTitle || finalPrice === undefined) {
      const prod = await Product.findById(productId).lean();
      if (!prod) {
        return res.status(400).json({ error: 'Product not found for given productId' });
      }
      if (!finalTitle) finalTitle = prod.name;
      if (finalPrice === undefined) finalPrice = prod.price;
      if (!finalImage) finalImage = (prod.media && prod.media[0] && prod.media[0].url) || '';
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].qty += qty;
    } else {
      // Add new item to cart
        const newItem: CartItem = {
          productId,
          title: finalTitle,
          price: finalPrice,
          qty,
          image: finalImage
        };
      user.cart.push(newItem);
    }

    await user.save();
    res.json({ cart: user.cart, message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update item quantity in cart
router.put('/update', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { productId, qty } = req.body;

    if (!productId || qty === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = user.cart.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].qty = qty;
    }

    await user.save();
    res.json({ cart: user.cart, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = user.cart.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    res.json({ cart: user.cart, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({ cart: [], message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
