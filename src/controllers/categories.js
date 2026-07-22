// Import needed model functions
import { 
  getAllCategories, 
  getCategoryById, 
  getProjectsByCategoryId 
} from '../models/categories.js';

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

// Export controller functions
export { showCategoriesPage, showCategoryDetailsPage };
