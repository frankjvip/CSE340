-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    project_location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- ========================================
-- Insert projects for BrightFuture Builders id = 1
-- ========================================
INSERT INTO project (organization_id, title, description, project_location, project_date) 
VALUES
(1, 'Title_1', 'Description_1', 'Location_1', '2026-07-26'),
(1, 'Title_2', 'Description_2', 'Location_2', '2026-08-08'),
(1, 'Title_3', 'Description_3', 'Location_3', '2026-08-26'),
(1, 'Title_4', 'Description_4', 'Location_4', '2026-09-26'),
(1, 'Title_5', 'Description_5', 'Location_5', '2026-10-26');

-- ========================================
-- Insert projects for GreenHarvest Growers id = 2
-- ========================================
INSERT INTO project (organization_id, title, description, project_location, project_date) 
VALUES
(2, 'Title_6', 'Description_6', 'Location_6', '2026-07-20'),
(2, 'Title_7', 'Description_7', 'Location_7', '2026-07-26'),
(2, 'Title_8', 'Description_8', 'Location_8', '2026-08-15'),
(2, 'Title_9', 'Description_9', 'Location_9', '2026-09-10'),
(2, 'Title_10', 'Description_10', 'Location_10', '2026-10-15');

-- ========================================
-- Insert projects for UnityServe Volunteers id = 3
-- ========================================
INSERT INTO project (organization_id, title, description, project_location, project_date) 
VALUES
(3, 'Title_11', 'Description_11', 'Location_11', '2026-07-20'),
(3, 'Title_12', 'Description_12', 'Location_12', '2026-07-26'),
(3, 'Title_13', 'Description_13', 'Location_13', '2026-08-15'),
(3, 'Title_14', 'Description_14', 'Location_14', '2026-09-10'),
(3, 'Title_15', 'Description_15', 'Location_15', '2026-10-15');

-- ========================================
-- Query to verify data
-- ========================================
SELECT a.project_id, a.organization_id, b.name, a.title, a.description, a.project_location, a.project_date 
FROM project AS a 
JOIN organization AS b ON a.organization_id = b.organization_id
ORDER BY b.name;


-- ========================================
-- Categories Table
-- ========================================
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Categories Junction Table
-- (Many-to-Many relationship between projects and categories)
-- ========================================
CREATE TABLE project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- ========================================
-- Insert at least 3 categories
-- ========================================
INSERT INTO categories (name) VALUES
('Environmental'),
('Educational'),
('Community Service');

-- ========================================
-- Associate projects with categories (example)
-- ========================================
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), -- Project 1 → Environmental
(2, 2), -- Project 2 → Educational
(3, 3); -- Project 3 → Community Service
