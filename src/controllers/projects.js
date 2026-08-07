import { getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Reglas de validación para el formulario de proyecto
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 1000 })
        .withMessage('Project description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Please select a valid organization')
];

// Página principal de proyectos (solo próximos 5)
const showProjectsPage = async (req, res) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', { title: 'Upcoming Service Projects', projects });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Página de detalles de un proyecto
const showProjectDetailsPage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    const categories = await getCategoriesByProjectId(projectId);

    res.render('project', { 
      title: 'Service Project Details', 
      project, 
      categories 
    });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Mostrar formulario para nuevo proyecto
const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { 
            title: 'Add New Service Project', 
            organizations 
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Procesar envío del formulario de nuevo proyecto
const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    try {
        const { title, description, location, date, organizationId } = req.body;
        await createProject(title, description, location, date, organizationId);

        req.flash('success', 'Service project created successfully!');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error occurred:', error.message);
        req.flash('error', 'Failed to create service project.');
        res.redirect('/new-project');
    }
};

// Mostrar formulario para editar proyecto existente
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const organizations = await getAllOrganizations();

        // Formatear la fecha a YYYY-MM-DD para compatibilidad con el input type="date"
        if (project.project_date) {
            project.project_date = new Date(project.project_date).toISOString().split('T')[0];
        }

        res.render('edit-project', { 
            title: 'Edit Service Project', 
            project, 
            organizations 
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Procesar envío del formulario de edición de proyecto
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        const { title, description, location, date, organizationId } = req.body;
        await updateProject(projectId, title, description, location, date, organizationId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error occurred:', error.message);
        req.flash('error', 'Failed to update service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm,
    processEditProjectForm,
    projectValidation 
};