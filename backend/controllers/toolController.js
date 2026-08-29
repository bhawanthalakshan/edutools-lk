const Tool = require('../models/Tool');
const Category = require('../models/Category');

// @desc    Get all tools (supports category filter)
// @route   GET /api/tools
// @access  Public
const getTools = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    const query = {};
    if (all !== 'true') {
      query.status = 'active';
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category.toLowerCase() });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      }
    }

    const tools = await Tool.find(query)
      .populate('category', 'name slug icon')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tool by slug
// @route   GET /api/tools/:slug
// @access  Public
const getToolBySlug = async (req, res, next) => {
  try {
    const tool = await Tool.findOne({
      slug: req.params.slug.toLowerCase(),
    }).populate('category', 'name slug icon description');

    if (!tool) {
      res.status(404);
      throw new Error(`Tool with slug '${req.params.slug}' not found`);
    }

    res.status(200).json({
      success: true,
      data: tool,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new tool
// @route   POST /api/tools
// @access  Private/Admin
const createTool = async (req, res, next) => {
  try {
    const { name, slug, description, category, icon, status } = req.body;

    if (!name || !slug) {
      res.status(400);
      throw new Error('Please provide name and slug for the tool');
    }

    const existingTool = await Tool.findOne({ slug: slug.toLowerCase() });
    if (existingTool) {
      res.status(400);
      throw new Error(`Tool with slug '${slug}' already exists`);
    }

    const tool = await Tool.create({
      name,
      slug: slug.toLowerCase(),
      description: description || '',
      category: category || null,
      icon: icon || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Tool created successfully',
      data: tool,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tool by ID
// @route   PUT /api/tools/:id
// @access  Private/Admin
const updateTool = async (req, res, next) => {
  try {
    let tool = await Tool.findById(req.params.id);
    if (!tool) {
      res.status(404);
      throw new Error(`Tool not found with id ${req.params.id}`);
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    }

    tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Tool updated successfully',
      data: tool,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tool by ID
// @route   DELETE /api/tools/:id
// @access  Private/Admin
const deleteTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      res.status(404);
      throw new Error(`Tool not found with id ${req.params.id}`);
    }

    await tool.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tool deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTools,
  getToolBySlug,
  createTool,
  updateTool,
  deleteTool,
};
