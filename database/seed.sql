-- Haryana ULB Seed Data
-- Based on the provided organizational structure

-- Insert main organizations
INSERT INTO departments (id, name, parent_id, level, organization, description) VALUES
(1, 'Haryana Urban Local Bodies Department', NULL, 0, 'ULB', 'State-level department overseeing all urban local bodies'),
(2, 'Municipal Corporation of Gurugram (MCG)', 1, 1, 'MCG', 'Municipal corporation for Gurugram city'),
(3, 'Gurugram Metropolitan Development Authority (GMDA)', 1, 1, 'GMDA', 'Development authority for Gurugram metropolitan area'),
(4, 'Ward System', 2, 2, 'WARD', 'Ward-level governance structure (36 wards)');

-- ULB Department Structure
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
('Minister Office', 1, 1, 'ULB', 'Minister of Urban Local Bodies, Haryana'),
('Additional Chief Secretary Office', 1, 1, 'ULB', 'Additional Chief Secretary to Government of Haryana, ULB Department'),
('Principal Secretary Office', 1, 1, 'ULB', 'Principal Secretary, ULB Department'),
('Director Office', 1, 1, 'ULB', 'Director, Urban Local Bodies Department'),
('Deputy Secretary Office', 1, 2, 'ULB', 'Deputy Secretary to Government of Haryana, ULB Department'),
('Additional Directors', 1, 2, 'ULB', 'Additional Directors for various functions'),
('Deputy Directors', 1, 2, 'ULB', 'Deputy Directors and Wing Heads'),
('Senior Officers', 1, 2, 'ULB', 'Senior Officers & Functional Staff'),
('Support Staff', 1, 2, 'ULB', 'Support Staff across all functions'),
('Policy & Planning Branch', 1, 2, 'ULB', 'Policy formulation and planning');

-- MCG Structure
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
('Mayor Office', 2, 1, 'MCG', 'Elected head of Municipal Corporation'),
('Municipal Commissioner Office', 2, 1, 'MCG', 'Administrative head of MCG'),
('Additional Commissioner I (Revenue)', 2, 2, 'MCG', 'Revenue and taxation functions'),
('Additional Commissioner II (Operations)', 2, 2, 'MCG', 'Operations and works'),
('Chief Accounts Officer', 2, 2, 'MCG', 'Financial management and accounts'),
('Joint Commissioner - Administration', 2, 2, 'MCG', 'HR and administrative functions'),
('Joint Commissioner - Taxation', 2, 2, 'MCG', 'Tax assessment and collection'),
('Joint Commissioner - IT', 2, 2, 'MCG', 'Information technology services'),
('Joint Commissioner - Legal', 2, 2, 'MCG', 'Legal affairs and litigation'),
('Engineering Departments', 2, 2, 'MCG', 'Civil, Public Health, and Electrical engineering'),
('Town Planning Department', 2, 2, 'MCG', 'Urban planning and development'),
('Sanitation Department', 2, 2, 'MCG', 'Sanitation and waste management'),
('Fire Services Department', 2, 2, 'MCG', 'Fire safety and emergency services'),
('Swachh Bharat Mission Department', 2, 2, 'MCG', 'Clean India mission implementation');

-- GMDA Structure
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
('Chairperson Office', 3, 1, 'GMDA', 'Chief Minister as Chairperson'),
('Board of Directors', 3, 1, 'GMDA', '17 member board including various officials'),
('CEO Office', 3, 1, 'GMDA', 'Chief Executive Officer'),
('Additional CEO Office', 3, 2, 'GMDA', 'Additional CEO support'),
('Divisional Commissioner Office', 3, 2, 'GMDA', 'Ex-Officio member office'),
('Mobility Division', 3, 2, 'GMDA', 'Traffic and transport planning'),
('Roads & Infrastructure Division', 3, 2, 'GMDA', 'Road development and infrastructure'),
('Drainage & Water Division', 3, 2, 'GMDA', 'Water management and drainage'),
('Urban Environment Division', 3, 2, 'GMDA', 'Environmental planning and management'),
('Urban Planning Division', 3, 2, 'GMDA', 'City planning and development'),
('IT & Smart City Division', 3, 2, 'GMDA', 'Smart city initiatives and IT'),
('Finance & Administration Division', 3, 2, 'GMDA', 'Financial and administrative management');

-- Ward Structure (sample for first few wards)
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
('Ward 1', 4, 3, 'WARD', 'Ward 1 governance structure'),
('Ward 2', 4, 3, 'WARD', 'Ward 2 governance structure'),
('Ward 3', 4, 3, 'WARD', 'Ward 3 governance structure');

-- Continue with roles for key positions
-- ULB Department Roles
INSERT INTO roles (title, department_id, description, is_leadership) VALUES
('Minister of Urban Local Bodies', 5, 'State Minister overseeing ULB affairs', TRUE),
('Additional Chief Secretary', 6, 'Senior administrative officer', TRUE),
('Principal Secretary', 7, 'Principal Secretary, ULB Department', TRUE),
('Director', 8, 'Director, Urban Local Bodies Department', TRUE),
('Deputy Secretary', 9, 'Deputy Secretary to Government', FALSE),
('Additional Director - Engineering', 10, 'Engineering oversight', TRUE),
('Additional Director - Finance', 10, 'Financial oversight', TRUE),
('Additional Director - Legal', 10, 'Legal affairs', TRUE),
('Additional Director - Headquarters', 10, 'HQ operations', TRUE),
('Deputy Director - Administration', 11, 'Administrative functions', FALSE),
('Deputy Director - Planning', 11, 'Urban planning', FALSE),
('Deputy Director - IT', 11, 'Information technology', FALSE),
('Deputy Director - Election', 11, 'Election management', FALSE),
('Chief Town Planner', 12, 'Senior planning position', TRUE),
('Senior Town Planner', 12, 'Town planning', FALSE),
('Chief Engineer', 12, 'Engineering leadership', TRUE),
('Executive Engineer', 12, 'Engineering execution', FALSE),
('Junior Engineer', 12, 'Field engineering', FALSE);

-- MCG Roles
INSERT INTO roles (title, department_id, description, is_leadership) VALUES
('Mayor', (SELECT id FROM departments WHERE name = 'Mayor Office' AND organization = 'MCG'), 'Elected head of MCG', TRUE),
('Municipal Commissioner', (SELECT id FROM departments WHERE name = 'Municipal Commissioner Office' AND organization = 'MCG'), 'Administrative head', TRUE),
('Additional Commissioner I (Revenue)', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 'Revenue management', TRUE),
('Additional Commissioner II (Operations)', (SELECT id FROM departments WHERE name = 'Additional Commissioner II (Operations)' AND organization = 'MCG'), 'Operations management', TRUE),
('Chief Accounts Officer', (SELECT id FROM departments WHERE name = 'Chief Accounts Officer' AND organization = 'MCG'), 'Financial oversight', TRUE),
('Joint Commissioner - Administration', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'HR and admin', TRUE),
('Chief Town Planner', (SELECT id FROM departments WHERE name = 'Town Planning Department' AND organization = 'MCG'), 'Urban planning head', TRUE),
('Senior Town Planner', (SELECT id FROM departments WHERE name = 'Town Planning Department' AND organization = 'MCG'), 'Senior planner', FALSE),
('Chief Engineer - Civil', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 'Civil engineering head', TRUE),
('Chief Engineer - Public Health', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 'PH engineering head', TRUE),
('Chief Engineer - Electrical', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 'Electrical engineering head', TRUE),
('Joint Commissioner - Fire Services', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Fire services head', TRUE),
('Joint Commissioner - Swachh Bharat', (SELECT id FROM departments WHERE name = 'Swachh Bharat Mission Department' AND organization = 'MCG'), 'Sanitation mission head', TRUE);

-- GMDA Roles
INSERT INTO roles (title, department_id, description, is_leadership) VALUES
('Chairperson', (SELECT id FROM departments WHERE name = 'Chairperson Office' AND organization = 'GMDA'), 'Chief Minister as Chairperson', TRUE),
('Chief Executive Officer', (SELECT id FROM departments WHERE name = 'CEO Office' AND organization = 'GMDA'), 'CEO of GMDA', TRUE),
('Additional CEO', (SELECT id FROM departments WHERE name = 'Additional CEO Office' AND organization = 'GMDA'), 'Additional CEO support', TRUE),
('Chief General Manager - Mobility', (SELECT id FROM departments WHERE name = 'Mobility Division' AND organization = 'GMDA'), 'Mobility division head', TRUE),
('Chief Engineer - Roads & Infrastructure', (SELECT id FROM departments WHERE name = 'Roads & Infrastructure Division' AND organization = 'GMDA'), 'Infrastructure head', TRUE),
('Chief Engineer - Drainage & Water', (SELECT id FROM departments WHERE name = 'Drainage & Water Division' AND organization = 'GMDA'), 'Water management head', TRUE),
('Chief Engineer - Environment', (SELECT id FROM departments WHERE name = 'Urban Environment Division' AND organization = 'GMDA'), 'Environment head', TRUE),
('Chief Town Planner', (SELECT id FROM departments WHERE name = 'Urban Planning Division' AND organization = 'GMDA'), 'Planning head', TRUE),
('Chief Information Officer', (SELECT id FROM departments WHERE name = 'IT & Smart City Division' AND organization = 'GMDA'), 'IT head', TRUE),
('Chief Financial Officer', (SELECT id FROM departments WHERE name = 'Finance & Administration Division' AND organization = 'GMDA'), 'Finance head', TRUE);

-- Ward Roles (sample)
INSERT INTO roles (title, department_id, description, is_leadership) VALUES
('Ward Councillor', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Elected ward representative', TRUE),
('Supervisor', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Ward office supervisor', FALSE),
('Clerk', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Administrative clerk', FALSE),
('Junior Engineer - Civil', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Ward civil engineer', FALSE),
('Junior Engineer - Public Health', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Ward PH engineer', FALSE),
('Junior Engineer - Electrical', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Ward electrical engineer', FALSE),
('Sanitary Inspector', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Sanitation oversight', FALSE),
('Tax Clerk', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Property tax management', FALSE),
('Revenue Inspector', (SELECT id FROM departments WHERE name = 'Ward 1' AND organization = 'WARD'), 'Revenue collection', FALSE);

-- Personnel (key positions with actual names where provided)
INSERT INTO personnel (name, role_id, contact, email, is_elected) VALUES
('Nayab Singh Saini', (SELECT id FROM roles WHERE title = 'Chairperson' AND department_id = (SELECT id FROM departments WHERE name = 'Chairperson Office' AND organization = 'GMDA')), '', '', TRUE),
('Shyamal Misra, IAS', (SELECT id FROM roles WHERE title = 'Chief Executive Officer' AND department_id = (SELECT id FROM departments WHERE name = 'CEO Office' AND organization = 'GMDA')), '', '', FALSE),
('Vikas Gupta, IAS', (SELECT id FROM roles WHERE title = 'Principal Secretary'), '', '', FALSE),
('Yatender Sain', (SELECT id FROM roles WHERE title = 'Additional Director - Engineering'), '', '', FALSE),
('Ranbir Parashar', (SELECT id FROM roles WHERE title = 'Deputy Director - Election'), '', '', FALSE),
('Raj Rani Malhotra', (SELECT id FROM roles WHERE title = 'Mayor' AND department_id = (SELECT id FROM departments WHERE name = 'Mayor Office' AND organization = 'MCG')), '', '', TRUE),
('Pradeep Dahiya', (SELECT id FROM roles WHERE title = 'Municipal Commissioner' AND department_id = (SELECT id FROM departments WHERE name = 'Municipal Commissioner Office' AND organization = 'MCG')), '', '', FALSE),
('Yash Jaluka', (SELECT id FROM roles WHERE title = 'Additional Commissioner I (Revenue)'), '', '', FALSE),
('Raj Kumar Singh', (SELECT id FROM roles WHERE title = 'Chief Town Planner' AND department_id = (SELECT id FROM departments WHERE name = 'Town Planning Department' AND organization = 'MCG')), '', '', FALSE),
('Sanjeev Maan', (SELECT id FROM roles WHERE title = 'Senior Town Planner' AND department_id = (SELECT id FROM departments WHERE name = 'Town Planning Department' AND organization = 'MCG')), '', '', FALSE),
('Raman Sharma', (SELECT id FROM roles WHERE title = 'Chief Engineer - Civil'), '', '', FALSE),
('Raman Yadav', (SELECT id FROM roles WHERE title = 'Chief Engineer - Electrical'), '', '', FALSE),
('B.B. Kalra', (SELECT id FROM roles WHERE title = 'Chief Accounts Officer'), '', '', FALSE),
('Naresh Kumar', (SELECT id FROM roles WHERE title = 'Joint Commissioner - Administration'), '', '', FALSE),
('Akhilesh Kumar', (SELECT id FROM roles WHERE title = 'Joint Commissioner - Swachh Bharat'), '', '', FALSE);

-- Sample wards data
INSERT INTO wards (ward_number, zone_id, area_description, population) VALUES
(1, 1, 'Sector 1-5 area', 25000),
(2, 1, 'Sector 6-10 area', 28000),
(3, 1, 'Sector 11-15 area', 30000),
(4, 2, 'Sector 16-20 area', 32000),
(5, 2, 'Sector 21-25 area', 29000),
(6, 2, 'Sector 26-30 area', 31000),
(7, 3, 'Old Gurugram area', 35000),
(8, 3, 'Industrial area', 22000),
(9, 3, 'Commercial hub', 27000),
(10, 4, 'Residential area', 33000);
