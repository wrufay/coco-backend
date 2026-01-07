import { Response } from 'express';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth';

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ userId: req.userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = new Category({
      ...req.body,
      userId: req.userId
    });
    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOneAndDelete({ _id: id, userId: req.userId });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
