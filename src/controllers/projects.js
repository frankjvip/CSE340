import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

    // NEW: get categories for this project
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

export { showProjectsPage, showProjectDetailsPage };
