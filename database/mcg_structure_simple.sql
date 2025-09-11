-- Simple MCG structure update using existing IDs
-- Add missing departments to complete the hierarchy

-- First, let's add the detailed sub-departments that are missing
INSERT OR IGNORE INTO departments (name, parent_id, level, organization, description) VALUES
-- Under Additional Commissioner I (Revenue) - id 17
('Deputy Commissioner (Property Tax)', 17, 3, 'MCG', 'Property tax management'),
('Tax Inspectors', 17, 3, 'MCG', 'Field tax inspection'),
('Revenue Officers', 17, 3, 'MCG', 'Revenue collection'),
('Assessment Officers', 17, 3, 'MCG', 'Property assessment'),
('Support Staff (Revenue)', 17, 3, 'MCG', 'Data Entry, Clerks'),

-- Under Additional Commissioner II (Operations) - id 18
('Deputy Commissioner (Works)', 18, 3, 'MCG', 'Public works management'),
('Zonal Joint Commissioners', 18, 3, 'MCG', 'Zones 1 to 4'),
('Chief Town Planner', 18, 3, 'MCG', 'Raj Kumar Singh'),
('Chief Sanitation Officer', 18, 3, 'MCG', 'Sanitation and cleanliness'),
('Chief Engineer - Civil', 18, 3, 'MCG', 'Raman Sharma'),
('Chief Engineer - Public Health', 18, 3, 'MCG', 'Water supply and sewerage'),
('Chief Engineer - Electrical', 18, 3, 'MCG', 'Raman Yadav'),
('Fire Services Department', 18, 3, 'MCG', 'Fire safety and emergency'),
('Swachh Bharat Mission Department', 18, 3, 'MCG', 'Akhilesh Kumar'),

-- Under Chief Accounts Officer - id 19
('Senior Accountants', 19, 3, 'MCG', 'Senior accounting staff'),
('Accountants', 19, 3, 'MCG', 'Regular accounting staff'),
('Junior Accountants', 19, 3, 'MCG', 'Junior accounting staff'),
('Audit Officers', 19, 3, 'MCG', 'Internal audit'),
('Accounts Support Staff', 19, 3, 'MCG', 'Administrative support'),

-- Under Joint Commissioner - Administration - id 20
('HR Officer', 20, 3, 'MCG', 'Human resources management'),
('Recruitment Officer', 20, 3, 'MCG', 'Staff recruitment'),
('Training Coordinator', 20, 3, 'MCG', 'Staff training programs'),
('Administrative Assistants', 20, 3, 'MCG', 'Administrative support'),

-- Under Joint Commissioner - Taxation - id 21
('Tax Assessors', 21, 3, 'MCG', 'Tax assessment'),
('Revenue Inspectors', 21, 3, 'MCG', 'Revenue inspection'),
('Tax Recovery Officers', 21, 3, 'MCG', 'Tax collection'),
('Tax Clerks and Support Staff', 21, 3, 'MCG', 'Administrative support'),

-- Under Joint Commissioner - IT - id 22
('Software Developers', 22, 3, 'MCG', 'Software development'),
('Cybersecurity Specialists', 22, 3, 'MCG', 'IT security'),
('Network Administrators', 22, 3, 'MCG', 'Network management'),
('IT Support Technicians', 22, 3, 'MCG', 'Technical support'),

-- Under Joint Commissioner - Legal - id 23
('Legal Advisors', 23, 3, 'MCG', 'Legal counsel'),
('Legal Assistants', 23, 3, 'MCG', 'Legal support'),
('Litigation Officers', 23, 3, 'MCG', 'Court proceedings'),
('Clerical Support (Legal)', 23, 3, 'MCG', 'Administrative support');
