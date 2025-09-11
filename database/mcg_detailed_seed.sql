-- Complete MCG Hierarchy with Detailed Role Information
-- This extends the existing seed data with comprehensive MCG structure

-- First, let's add the detailed MCG departments
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
-- Additional Commissioner I (Revenue) sub-departments
('Deputy Commissioner (Property Tax)', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 3, 'MCG', 'Property tax assessment and collection'),
('Tax Inspection Division', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 3, 'MCG', 'Field tax inspection and verification'),
('Revenue Office', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 3, 'MCG', 'Revenue collection and management'),
('Assessment Office', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 3, 'MCG', 'Property assessment and valuation'),

-- Additional Commissioner II (Operations) sub-departments
('Deputy Commissioner (Works)', (SELECT id FROM departments WHERE name = 'Additional Commissioner II (Operations)' AND organization = 'MCG'), 3, 'MCG', 'Public works and infrastructure'),
('Zonal Administration', (SELECT id FROM departments WHERE name = 'Additional Commissioner II (Operations)' AND organization = 'MCG'), 3, 'MCG', 'Zone-wise administrative operations'),
('Civil Engineering Wing', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 3, 'MCG', 'Civil engineering projects and maintenance'),
('Public Health Engineering Wing', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 3, 'MCG', 'Water supply and sewerage systems'),
('Electrical Engineering Wing', (SELECT id FROM departments WHERE name = 'Engineering Departments' AND organization = 'MCG'), 3, 'MCG', 'Street lighting and electrical infrastructure');

-- Add zones for better organization
INSERT INTO departments (name, parent_id, level, organization, description) VALUES
('Zone 1', (SELECT id FROM departments WHERE name = 'Zonal Administration' AND organization = 'MCG'), 4, 'MCG', 'Municipal zone 1 covering sectors 1-15'),
('Zone 2', (SELECT id FROM departments WHERE name = 'Zonal Administration' AND organization = 'MCG'), 4, 'MCG', 'Municipal zone 2 covering sectors 16-30'),
('Zone 3', (SELECT id FROM departments WHERE name = 'Zonal Administration' AND organization = 'MCG'), 4, 'MCG', 'Municipal zone 3 covering sectors 31-45'),
('Zone 4', (SELECT id FROM departments WHERE name = 'Zonal Administration' AND organization = 'MCG'), 4, 'MCG', 'Municipal zone 4 covering sectors 46-58');

-- Add detailed roles with comprehensive information
INSERT INTO roles (title, department_id, description, is_leadership) VALUES
-- Revenue Department Roles
('Deputy Commissioner (Property Tax)', (SELECT id FROM departments WHERE name = 'Deputy Commissioner (Property Tax)' AND organization = 'MCG'), 'Oversees property tax assessment, collection, and appeals. Responsible for revenue targets and tax policy implementation.', TRUE),
('Tax Inspector', (SELECT id FROM departments WHERE name = 'Tax Inspection Division' AND organization = 'MCG'), 'Conducts field inspections for property assessment, verifies tax compliance, handles tax disputes at ground level.', FALSE),
('Revenue Officer', (SELECT id FROM departments WHERE name = 'Revenue Office' AND organization = 'MCG'), 'Manages revenue collection processes, maintains revenue records, coordinates with banks for tax collection.', FALSE),
('Assessment Officer', (SELECT id FROM departments WHERE name = 'Assessment Office' AND organization = 'MCG'), 'Conducts property valuations, updates assessment records, handles reassessment cases.', FALSE),

-- Operations Department Roles
('Deputy Commissioner (Works)', (SELECT id FROM departments WHERE name = 'Deputy Commissioner (Works)' AND organization = 'MCG'), 'Supervises all public works, infrastructure development, and maintenance activities across the city.', TRUE),
('Zonal Joint Commissioner', (SELECT id FROM departments WHERE name = 'Zone 1' AND organization = 'MCG'), 'Manages zone-specific operations, coordinates between departments, handles citizen complaints at zonal level.', TRUE),
('Executive Engineer - Civil', (SELECT id FROM departments WHERE name = 'Civil Engineering Wing' AND organization = 'MCG'), 'Plans and executes civil engineering projects, road construction, building maintenance, structural works.', TRUE),
('Assistant Executive Engineer - Civil', (SELECT id FROM departments WHERE name = 'Civil Engineering Wing' AND organization = 'MCG'), 'Assists in project execution, site supervision, quality control, and technical documentation.', FALSE),
('Junior Engineer - Civil', (SELECT id FROM departments WHERE name = 'Civil Engineering Wing' AND organization = 'MCG'), 'Field-level engineering support, site measurements, basic design work, progress monitoring.', FALSE),
('Site Inspector', (SELECT id FROM departments WHERE name = 'Civil Engineering Wing' AND organization = 'MCG'), 'Daily site inspections, quality checks, safety compliance, progress reporting.', FALSE),

-- Public Health Engineering
('Executive Engineer - Public Health', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Manages water supply systems, sewerage networks, drainage infrastructure, and public health facilities.', TRUE),
('Junior Engineer - Public Health', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Maintains water supply lines, sewerage systems, handles public health infrastructure issues.', FALSE),
('Field Health Inspector', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Inspects water quality, monitors sanitation facilities, investigates health-related complaints.', FALSE),

-- Electrical Engineering
('Executive Engineer - Electrical', (SELECT id FROM departments WHERE name = 'Electrical Engineering Wing' AND organization = 'MCG'), 'Manages street lighting, electrical installations in municipal buildings, power infrastructure.', TRUE),
('Junior Engineer - Electrical', (SELECT id FROM departments WHERE name = 'Electrical Engineering Wing' AND organization = 'MCG'), 'Maintains street lights, electrical systems, handles power-related municipal works.', FALSE),
('Electrician', (SELECT id FROM departments WHERE name = 'Electrical Engineering Wing' AND organization = 'MCG'), 'Repairs and maintains electrical equipment, street lighting, municipal electrical installations.', FALSE),

-- Sanitation Department
('Sanitary Inspector', (SELECT id FROM departments WHERE name = 'Sanitation Department' AND organization = 'MCG'), 'Monitors cleanliness standards, supervises sanitation workers, handles waste management complaints.', FALSE),
('Sanitary Worker', (SELECT id FROM departments WHERE name = 'Sanitation Department' AND organization = 'MCG'), 'Performs street cleaning, garbage collection, drain cleaning, and general sanitation duties.', FALSE),

-- Fire Services
('Joint Commissioner - Fire Services', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Heads fire prevention and emergency response, manages fire stations, coordinates disaster response.', TRUE),
('Fire Inspector', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Conducts fire safety inspections, issues NOCs, ensures compliance with fire safety norms.', FALSE),
('Firefighter', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Responds to fire emergencies, conducts rescue operations, maintains fire equipment.', FALSE),
('Fire Safety Officer', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Develops fire safety protocols, conducts training programs, investigates fire incidents.', FALSE),

-- Accounts Department
('Senior Accountant', (SELECT id FROM departments WHERE name = 'Chief Accounts Officer' AND organization = 'MCG'), 'Manages financial accounts, prepares budgets, oversees financial transactions and reporting.', FALSE),
('Accountant', (SELECT id FROM departments WHERE name = 'Chief Accounts Officer' AND organization = 'MCG'), 'Maintains day-to-day accounts, processes payments, prepares financial statements.', FALSE),
('Audit Officer', (SELECT id FROM departments WHERE name = 'Chief Accounts Officer' AND organization = 'MCG'), 'Conducts internal audits, ensures compliance with financial regulations, investigates irregularities.', FALSE),

-- Administration Department
('HR Officer', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Manages human resources, recruitment processes, employee welfare, and policy implementation.', FALSE),
('Recruitment Officer', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Conducts recruitment drives, manages hiring processes, maintains employee records.', FALSE),
('Training Coordinator', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Organizes training programs, skill development initiatives, capacity building activities.', FALSE),

-- IT Department
('Software Developer', (SELECT id FROM departments WHERE name = 'Joint Commissioner - IT' AND organization = 'MCG'), 'Develops municipal software applications, maintains IT systems, creates digital solutions.', FALSE),
('Cybersecurity Specialist', (SELECT id FROM departments WHERE name = 'Joint Commissioner - IT' AND organization = 'MCG'), 'Ensures IT security, manages data protection, handles cyber threats and security protocols.', FALSE),
('Network Administrator', (SELECT id FROM departments WHERE name = 'Joint Commissioner - IT' AND organization = 'MCG'), 'Manages network infrastructure, maintains servers, ensures connectivity across offices.', FALSE),

-- Legal Department
('Legal Advisor', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Legal' AND organization = 'MCG'), 'Provides legal counsel, drafts legal documents, represents MCG in legal matters.', FALSE),
('Litigation Officer', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Legal' AND organization = 'MCG'), 'Handles court cases, manages legal proceedings, coordinates with external lawyers.', FALSE);

-- Create a table for role responsibilities and escalation
CREATE TABLE IF NOT EXISTS role_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    responsibilities TEXT,
    reporting_to TEXT,
    escalation_process TEXT,
    grievance_contact TEXT,
    service_standards TEXT,
    rts_timeline INTEGER, -- in days
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert detailed role information
INSERT INTO role_details (role_id, responsibilities, reporting_to, escalation_process, grievance_contact, service_standards, rts_timeline) VALUES
-- Mayor
((SELECT id FROM roles WHERE title = 'Mayor' AND department_id = (SELECT id FROM departments WHERE name = 'Mayor Office' AND organization = 'MCG')), 
'1. Presides over municipal meetings and council sessions
2. Represents MCG in official functions and ceremonies
3. Approves major policy decisions and budget allocations
4. Oversees overall municipal governance and administration
5. Addresses citizen concerns and public grievances
6. Coordinates with state government and other agencies', 
'Directly elected by citizens', 
'1. Direct representation to Mayor office
2. Public grievance meetings (every Tuesday 10 AM - 12 PM)
3. Online grievance portal
4. RTI applications for transparency', 
'Mayor Office: 0124-2345678, mayor@mcgurugram.gov.in', 
'Meeting requests: 7 days, Policy decisions: 30 days, Public grievances: 15 days', 
15),

-- Municipal Commissioner
((SELECT id FROM roles WHERE title = 'Municipal Commissioner' AND department_id = (SELECT id FROM departments WHERE name = 'Municipal Commissioner Office' AND organization = 'MCG')), 
'1. Chief executive officer of MCG
2. Implements council decisions and policies
3. Supervises all municipal departments and operations
4. Manages municipal budget and financial planning
5. Coordinates with state government and other agencies
6. Ensures service delivery and citizen satisfaction
7. Handles administrative appeals and disputes', 
'Mayor and State Government', 
'1. Direct complaint to Commissioner office
2. Appeal to State Urban Development Department
3. Complaint to Chief Secretary, Haryana
4. RTI and transparency mechanisms', 
'Commissioner Office: 0124-2345679, commissioner@mcgurugram.gov.in', 
'Administrative orders: 3 days, Service complaints: 7 days, Appeals: 15 days', 
7),

-- Additional Commissioner I (Revenue)
((SELECT id FROM roles WHERE title = 'Additional Commissioner I (Revenue)'), 
'1. Oversees all revenue collection activities
2. Manages property tax assessment and collection
3. Handles revenue-related appeals and disputes
4. Ensures compliance with tax policies and regulations
5. Coordinates with banks and financial institutions
6. Monitors revenue targets and collection efficiency
7. Supervises tax inspection and assessment teams', 
'Municipal Commissioner', 
'1. Appeal to Municipal Commissioner
2. Revenue appellate authority
3. State tax tribunal for major disputes
4. Ombudsman for service-related issues', 
'Revenue Office: 0124-2345680, revenue@mcgurugram.gov.in', 
'Tax assessments: 15 days, Appeals: 30 days, Refunds: 45 days', 
15),

-- Deputy Commissioner (Property Tax)
((SELECT id FROM roles WHERE title = 'Deputy Commissioner (Property Tax)'), 
'1. Direct supervision of property tax operations
2. Reviews and approves tax assessments
3. Handles tax-related complaints and appeals
4. Ensures timely collection and deposit of taxes
5. Coordinates with legal department for recovery
6. Maintains tax records and databases
7. Implements tax policy changes and updates', 
'Additional Commissioner I (Revenue)', 
'1. Appeal to Additional Commissioner I (Revenue)
2. Revenue appellate committee
3. Municipal Commissioner for policy issues
4. State revenue department for systemic issues', 
'Property Tax Office: 0124-2345681, propertytax@mcgurugram.gov.in', 
'New assessments: 10 days, Corrections: 7 days, Appeals: 21 days', 
10),

-- Tax Inspector
((SELECT id FROM roles WHERE title = 'Tax Inspector'), 
'1. Conducts field inspections for property verification
2. Assesses property values and tax liability
3. Investigates tax evasion and underreporting
4. Serves notices and collects pending dues
5. Maintains inspection records and reports
6. Assists in legal proceedings for recovery
7. Provides ground-level feedback on tax policies', 
'Deputy Commissioner (Property Tax)', 
'1. Complaint to Deputy Commissioner (Property Tax)
2. Additional Commissioner I (Revenue) for serious issues
3. Anti-corruption helpline for misconduct
4. Public grievance cell for service issues', 
'Tax Inspection: 0124-2345682, inspection@mcgurugram.gov.in', 
'Property inspections: 3 days, Assessment reports: 7 days, Notice service: 2 days', 
3),

-- Zonal Joint Commissioner
((SELECT id FROM roles WHERE title = 'Zonal Joint Commissioner'), 
'1. Overall administration of assigned municipal zone
2. Coordinates between different departments in zone
3. Handles citizen complaints and grievances at zone level
4. Supervises engineering and sanitation works in zone
5. Ensures timely service delivery to residents
6. Monitors performance of zonal staff and contractors
7. Conducts public meetings and awareness programs', 
'Additional Commissioner II (Operations)', 
'1. Appeal to Additional Commissioner II (Operations)
2. Municipal Commissioner for major issues
3. Zone-level grievance committee
4. Citizen facilitation center for service issues', 
'Zone Office: 0124-234568X, zoneX@mcgurugram.gov.in', 
'Citizen complaints: 3 days, Service requests: 7 days, Infrastructure issues: 15 days', 
7),

-- Executive Engineer - Civil
((SELECT id FROM roles WHERE title = 'Executive Engineer - Civil'), 
'1. Plans and executes civil engineering projects
2. Supervises road construction and maintenance
3. Manages building construction and repairs
4. Ensures quality control and safety standards
5. Prepares technical estimates and project reports
6. Coordinates with contractors and vendors
7. Handles technical appeals and disputes', 
'Chief Engineer - Civil', 
'1. Appeal to Chief Engineer - Civil
2. Additional Commissioner II (Operations) for policy issues
3. Technical committee for engineering disputes
4. Municipal Commissioner for major project issues', 
'Civil Engineering: 0124-2345684, civil@mcgurugram.gov.in', 
'Project approvals: 15 days, Work orders: 7 days, Quality inspections: 3 days', 
15),

-- Sanitary Inspector
((SELECT id FROM roles WHERE title = 'Sanitary Inspector'), 
'1. Monitors cleanliness and sanitation standards
2. Supervises sanitation workers and cleaning operations
3. Investigates sanitation-related complaints
4. Ensures proper waste collection and disposal
5. Conducts health and hygiene inspections
6. Implements cleanliness drives and awareness programs
7. Maintains sanitation records and reports', 
'Chief Sanitation Officer', 
'1. Complaint to Chief Sanitation Officer
2. Zonal Joint Commissioner for area-specific issues
3. Health department for public health concerns
4. Municipal Commissioner for policy matters', 
'Sanitation Office: 0124-2345685, sanitation@mcgurugram.gov.in', 
'Complaint response: 24 hours, Cleaning issues: 2 days, Inspection reports: 3 days', 
1);

-- Create grievance categories table
CREATE TABLE IF NOT EXISTS grievance_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    department_id INTEGER,
    escalation_level_1 TEXT,
    escalation_level_2 TEXT,
    escalation_level_3 TEXT,
    rts_timeline INTEGER,
    helpline_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Insert grievance categories
INSERT INTO grievance_categories (category_name, department_id, escalation_level_1, escalation_level_2, escalation_level_3, rts_timeline, helpline_number) VALUES
('Property Tax Issues', (SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 'Deputy Commissioner (Property Tax)', 'Additional Commissioner I (Revenue)', 'Municipal Commissioner', 15, '0124-PROP-TAX'),
('Road and Infrastructure', (SELECT id FROM departments WHERE name = 'Civil Engineering Wing' AND organization = 'MCG'), 'Executive Engineer - Civil', 'Chief Engineer - Civil', 'Additional Commissioner II (Operations)', 30, '0124-ROAD-FIX'),
('Water Supply Issues', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Junior Engineer - Public Health', 'Executive Engineer - Public Health', 'Chief Engineer - Public Health', 7, '0124-WATER-24'),
('Sanitation and Cleanliness', (SELECT id FROM departments WHERE name = 'Sanitation Department' AND organization = 'MCG'), 'Sanitary Inspector', 'Chief Sanitation Officer', 'Zonal Joint Commissioner', 2, '0124-CLEAN-UP'),
('Street Lighting', (SELECT id FROM departments WHERE name = 'Electrical Engineering Wing' AND organization = 'MCG'), 'Junior Engineer - Electrical', 'Executive Engineer - Electrical', 'Chief Engineer - Electrical', 3, '0124-LIGHT-ON'),
('Fire Safety and Emergency', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Fire Inspector', 'Joint Commissioner - Fire Services', 'Municipal Commissioner', 1, '101 / 0124-FIRE-911'),
('Legal and Court Matters', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Legal' AND organization = 'MCG'), 'Legal Advisor', 'Joint Commissioner - Legal', 'Municipal Commissioner', 45, '0124-LEGAL-AID'),
('General Administration', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'HR Officer', 'Joint Commissioner - Administration', 'Municipal Commissioner', 15, '0124-ADMIN-HELP');

-- Create Right to Service Act information table
CREATE TABLE IF NOT EXISTS rts_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT NOT NULL,
    department_id INTEGER,
    designated_officer TEXT,
    timeline_days INTEGER,
    documents_required TEXT,
    fee_amount DECIMAL(10,2),
    penalty_amount DECIMAL(10,2),
    appellate_authority TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Insert RTS services
INSERT INTO rts_services (service_name, department_id, designated_officer, timeline_days, documents_required, fee_amount, penalty_amount, appellate_authority) VALUES
('Property Tax Assessment', (SELECT id FROM departments WHERE name = 'Deputy Commissioner (Property Tax)' AND organization = 'MCG'), 'Deputy Commissioner (Property Tax)', 15, 'Property documents, Identity proof, Address proof', 500.00, 250.00, 'Additional Commissioner I (Revenue)'),
('Building Plan Approval', (SELECT id FROM departments WHERE name = 'Town Planning Department' AND organization = 'MCG'), 'Chief Town Planner', 30, 'Site plan, NOCs, Structural drawings, Ownership proof', 5000.00, 500.00, 'Municipal Commissioner'),
('Trade License', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Joint Commissioner - Administration', 21, 'Business registration, NOCs, Identity proof, Premises proof', 2000.00, 200.00, 'Municipal Commissioner'),
('Water Connection', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Executive Engineer - Public Health', 15, 'Property documents, NOC, Identity proof, Site plan', 3000.00, 300.00, 'Chief Engineer - Public Health'),
('Sewerage Connection', (SELECT id FROM departments WHERE name = 'Public Health Engineering Wing' AND organization = 'MCG'), 'Executive Engineer - Public Health', 21, 'Property documents, Water connection, Site plan, NOC', 4000.00, 400.00, 'Chief Engineer - Public Health'),
('Fire NOC', (SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Joint Commissioner - Fire Services', 30, 'Building plan, Safety equipment list, Insurance, Structural stability certificate', 1000.00, 100.00, 'Municipal Commissioner'),
('Death Certificate', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Registrar (Birth & Death)', 7, 'Death report, Identity proof of applicant, Hospital certificate', 50.00, 25.00, 'Municipal Commissioner'),
('Birth Certificate', (SELECT id FROM departments WHERE name = 'Joint Commissioner - Administration' AND organization = 'MCG'), 'Registrar (Birth & Death)', 7, 'Hospital birth report, Parents identity proof, Address proof', 50.00, 25.00, 'Municipal Commissioner');

-- Add contact information table
CREATE TABLE IF NOT EXISTS contact_information (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER,
    office_name TEXT,
    address TEXT,
    phone_numbers TEXT,
    email TEXT,
    office_hours TEXT,
    public_dealing_hours TEXT,
    emergency_number TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Insert contact information
INSERT INTO contact_information (department_id, office_name, address, phone_numbers, email, office_hours, public_dealing_hours, emergency_number, website) VALUES
((SELECT id FROM departments WHERE name = 'Mayor Office' AND organization = 'MCG'), 'Mayor Office', 'MCG Building, Sector 34, Gurugram', '0124-2345678, 0124-2345679', 'mayor@mcgurugram.gov.in', '9:00 AM - 6:00 PM', 'Tuesday 10:00 AM - 12:00 PM (Public Grievance)', '0124-MAYOR-24', 'www.mcgurugram.gov.in'),
((SELECT id FROM departments WHERE name = 'Municipal Commissioner Office' AND organization = 'MCG'), 'Municipal Commissioner Office', 'MCG Building, Sector 34, Gurugram', '0124-2345680, 0124-2345681', 'commissioner@mcgurugram.gov.in', '9:00 AM - 6:00 PM', '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM', '0124-COMM-24', 'www.mcgurugram.gov.in'),
((SELECT id FROM departments WHERE name = 'Additional Commissioner I (Revenue)' AND organization = 'MCG'), 'Revenue Office', 'MCG Building, Sector 34, Gurugram, Ground Floor', '0124-2345682, 0124-2345683', 'revenue@mcgurugram.gov.in', '9:00 AM - 6:00 PM', '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM', '0124-REVENUE-24', 'revenue.mcgurugram.gov.in'),
((SELECT id FROM departments WHERE name = 'Fire Services Department' AND organization = 'MCG'), 'Fire Services Headquarters', 'Fire Station, Sector 29, Gurugram', '101, 0124-2345684', 'fire@mcgurugram.gov.in', '24x7', '24x7 Emergency Services', '101', 'fire.mcgurugram.gov.in'),
((SELECT id FROM departments WHERE name = 'Sanitation Department' AND organization = 'MCG'), 'Sanitation Office', 'MCG Building, Sector 34, Gurugram, 2nd Floor', '0124-2345685, 0124-CLEAN-UP', 'sanitation@mcgurugram.gov.in', '6:00 AM - 10:00 PM', '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM', '0124-CLEAN-24', 'sanitation.mcgurugram.gov.in');
