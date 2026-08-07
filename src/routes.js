import express from 'express';

import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm); // GET form route
router.post('/new-organization', organizationValidation, processNewOrganizationForm); // POST submission route with validation
router.get('/edit-organization/:id', showEditOrganizationForm); // GET edit form route
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm); // POST edit form route with validation
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects
router.get('/projects', showProjectsPage);
router.get('/new-project', showNewProjectForm); // GET form route
router.post('/new-project', projectValidation, processNewProjectForm); // POST submission route with validation
router.get('/edit-project/:id', showEditProjectForm); // GET edit form route
router.post('/edit-project/:id', projectValidation, processEditProjectForm); // POST edit form route with validation
router.get('/project/:id', showProjectDetailsPage);

// Assign Categories to Project
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm); // GET form route
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm); // POST submission route

// Categories
router.get('/categories', showCategoriesPage);
router.get('/new-category', showNewCategoryForm); // GET create category form route
router.post('/new-category', categoryValidation, processNewCategoryForm); // POST create category route with validation
router.get('/edit-category/:id', showEditCategoryForm); // GET edit category form route
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm); // POST edit category route with validation
router.get('/category/:id', showCategoryDetailsPage); // category details

// Error handling
router.get('/test-error', testErrorPage);

export default router;