import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import Item from '../models/item';
import { validateItem, validatePagination } from '../middlewares/validators';
import ApiKeyMiddleware from '../middlewares/auth';

const router = express.Router();

// Middleware
// router.use(ApiKeyMiddleware);

// GET: Fetch all items with pagination, search, and filter
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;

    // Pagination and search validation
    const validation = validatePagination.validate({ page, limit, search });
    if (validation.error) {
      res.status(400).json({ message: validation.error.message });
      return;
    }

    const query: any = {};

    // Search by title if search query is provided
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Filter by status if status query is provided
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch items with pagination, sorting, and filtering
    const items = await Item.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Latest items first

    // Get the total count of items matching the query
    const total = await Item.countDocuments(query);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET: Fetch a specific item by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST: Add a new item
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = validateItem.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const newItem = new Item(value);
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT: Update an existing item
router.put('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { error, value } = validateItem.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE: Delete an item
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
