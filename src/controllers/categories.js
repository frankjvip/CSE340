import { body, validationResult } from 'express-validator';
import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Server-side validation rules for categories
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .isLength({ min: 3 })
    .withMessage('Category name must be at least 3 characters long.')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters.')
];

// Controller: show all categories
const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    next(error);
  }
};

// Controller: show category details page
const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const title = `Category: ${category.name}`;
    res.render('category', { title, category, projects });
  } catch (error) {
    next(error);
  }
};

// Controller: show assign categories form
const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const allCategories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
      title,
      project,
      allCategories,
      assignedCategories
    });
  } catch (error) {
    next(error);
  }
};

// Controller: process assign categories form submission
const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const categoryIds = req.body.categoryIds || [];

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update categories.');
    res.redirect(`/project/${req.params.projectId}/assign-categories`);
  }
};

// Controller: render form to create new category
const showNewCategoryForm = (req, res) => {
  res.render('new-category', {
    title: 'Add New Category',
    errors: null,
    name: ''
  });
};

// Controller: process creation of new category
const processNewCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  const { name } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('new-category', {
      title: 'Add New Category',
      errors: errors.array(),
      name
    });
  }

  try {
    await createCategory(name);
    req.flash('info', 'Category created successfully.');
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

// Controller: render form to edit category
const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    res.render('edit-category', {
      title: 'Edit Category',
      errors: null,
      category
    });
  } catch (error) {
    next(error);
  }
};

// Controller: process updating an existing category
const processEditCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      errors: errors.array(),
      category: { category_id: categoryId, name }
    });
  }

  try {
    await updateCategory(categoryId, name);
    req.flash('info', 'Category updated successfully.');
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

export { 
  showCategoriesPage, 
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};