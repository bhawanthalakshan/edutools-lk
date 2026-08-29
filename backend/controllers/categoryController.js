const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) {
      filter.type = type;
    }
    const categories = await Category.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      res.status(404);
      throw new Error(`Category with slug '${req.params.slug}' not found`);
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, type } = req.body;

    if (!name || !slug) {
      res.status(400);
      throw new Error('Please provide name and slug for the category');
    }

    // Check if category slug already exists
    const existingCategory = await Category.findOne({ slug: slug.toLowerCase() });
    if (existingCategory) {
      res.status(400);
      throw new Error(`Category with slug '${slug}' already exists`);
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      description: description || '',
      icon: icon || '',
      type: type || 'general',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category by ID
// @route   PUT /api/categories/:id
// @access  Public
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error(`Category not found with id ${req.params.id}`);
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
// @access  Public
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error(`Category not found with id ${req.params.id}`);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
