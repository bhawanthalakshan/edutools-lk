const Article = require('../models/Article');
const Category = require('../models/Category');

// @desc    Get articles with search, category filter, & pagination
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10, all } = req.query;

    const query = {};
    if (all !== 'true') {
      query.status = 'published';
    }

    // Search filter (matches title or excerpt)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter (supports either ObjectId or Category slug)
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
            pagination: { page: Number(page), limit: Number(limit), totalPages: 0, totalArticles: 0 },
            data: [],
          });
        }
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalArticles = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalArticles / limitNum);

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalArticles,
      },
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug.toLowerCase(),
    }).populate('category', 'name slug icon description');

    if (!article) {
      res.status(404);
      throw new Error(`Article with slug '${req.params.slug}' not found`);
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, featuredImage, category, tags, author, status, seoTitle, seoDescription } = req.body;

    if (!title || !slug || !content || !category) {
      res.status(400);
      throw new Error('Please provide title, slug, content, and category');
    }

    const existingArticle = await Article.findOne({ slug: slug.toLowerCase() });
    if (existingArticle) {
      res.status(400);
      throw new Error(`Article with slug '${slug}' already exists`);
    }

    const article = await Article.create({
      title,
      slug: slug.toLowerCase(),
      excerpt: excerpt || '',
      content,
      featuredImage: featuredImage || '',
      category,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [],
      author: author || 'EduTools LK Team',
      status: status || 'published',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || '',
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404);
      throw new Error(`Article not found with id ${req.params.id}`);
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase();
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404);
      throw new Error(`Article not found with id ${req.params.id}`);
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle article status (publish / unpublish)
// @route   PATCH /api/articles/:id/status
// @access  Private/Admin
const toggleArticleStatus = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      res.status(404);
      throw new Error(`Article not found with id ${req.params.id}`);
    }

    article.status = article.status === 'published' ? 'draft' : 'published';
    await article.save();

    res.status(200).json({
      success: true,
      message: `Article status updated to ${article.status}`,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
};
