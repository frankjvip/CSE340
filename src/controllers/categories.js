import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// Controller: show all categories
const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    console.error(error);
    res.status(500).render('500');
  }
};

// Controller: show category details page
const showCategoryDetailsPage = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).render('404');
    }

    const title = `Category: ${category.name}`;
    res.render('category', { title, category, projects });
  } catch (error) {
    console.error(error);
    res.status(500).render('500');
  }
};

// Controller: show assign categories form
const showAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).render('404');
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
    console.error(error);
    res.status(500).render('500');
  }
};

// Controller: process assign categories form submission
const processAssignCategoriesForm = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    // req.body.categoryIds can be undefined, a single string, or an array of strings
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

export { 
  showCategoriesPage, 
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};