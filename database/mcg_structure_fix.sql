-- Fix MCG Structure with Exact Hierarchy
-- Clear existing MCG data and rebuild with correct structure

-- First, clear existing MCG departments
DELETE FROM departments WHERE organization = 'MCG';

-- Insert the exact MCG hierarchy as provided
INSERT INTO departments (id, name, parent_id, level, organization, description) VALUES
-- Root level
(100, 'Mayor', NULL, 0, 'MCG', 'Elected Head: Raj Rani Malhotra'),
(101, 'Municipal Commissioner', 100, 1, 'MCG', 'IAS: Pradeep Dahiya'),

-- Level 2 - Direct reports to Municipal Commissioner
(102, 'Additional Commissioner I (Revenue)', 101, 2, 'MCG', 'Yash Jaluka'),
(103, 'Additional Commissioner II (Operations)', 101, 2, 'MCG', 'Operations and Works'),
(104, 'Chief Accounts Officer', 101, 2, 'MCG', 'B.B. Kalra'),
(105, 'Joint Commissioner - Administration', 101, 2, 'MCG', 'Naresh Kumar'),
(106, 'Joint Commissioner - Taxation', 101, 2, 'MCG', 'Tax Assessment and Collection'),
(107, 'Joint Commissioner - Information Technology (IT)', 101, 2, 'MCG', 'IT Services and Digital Infrastructure'),
(108, 'Joint Commissioner - Legal', 101, 2, 'MCG', 'Legal Affairs and Litigation'),
(109, 'Department Heads for Key Functional Areas', 101, 2, 'MCG', 'Specialized Department Heads'),

-- Level 3 - Under Additional Commissioner I (Revenue)
(110, 'Deputy Commissioner (Property Tax)', 102, 3, 'MCG', 'Property tax management'),
(111, 'Tax Inspectors', 102, 3, 'MCG', 'Field tax inspection'),
(112, 'Revenue Officers', 102, 3, 'MCG', 'Revenue collection'),
(113, 'Assessment Officers', 102, 3, 'MCG', 'Property assessment'),
(114, 'Support Staff (Data Entry, Clerks)', 102, 3, 'MCG', 'Administrative support'),

-- Level 3 - Under Additional Commissioner II (Operations)
(115, 'Deputy Commissioner (Works)', 103, 3, 'MCG', 'Public works management'),
(116, 'Zonal Joint Commissioners (Zones 1 to 4)', 103, 3, 'MCG', 'Zone-wise administration'),
(117, 'Chief Town Planner', 103, 3, 'MCG', 'Raj Kumar Singh'),
(118, 'Chief Sanitation Officer', 103, 3, 'MCG', 'Sanitation and cleanliness'),
(119, 'Chief Engineer - Civil', 103, 3, 'MCG', 'Raman Sharma'),
(120, 'Chief Engineer - Public Health', 103, 3, 'MCG', 'Water supply and sewerage'),
(121, 'Chief Engineer - Electrical', 103, 3, 'MCG', 'Raman Yadav'),
(122, 'Fire Services Department', 103, 3, 'MCG', 'Fire safety and emergency'),
(123, 'Swachh Bharat Mission Department', 103, 3, 'MCG', 'Clean India Mission'),

-- Level 3 - Under Chief Accounts Officer
(124, 'Senior Accountants', 104, 3, 'MCG', 'Senior accounting staff'),
(125, 'Accountants', 104, 3, 'MCG', 'Regular accounting staff'),
(126, 'Junior Accountants', 104, 3, 'MCG', 'Junior accounting staff'),
(127, 'Audit Officers', 104, 3, 'MCG', 'Internal audit'),
(128, 'Accounts Support Staff', 104, 3, 'MCG', 'Administrative support'),

-- Level 3 - Under Joint Commissioner - Administration
(129, 'HR Officer', 105, 3, 'MCG', 'Human resources management'),
(130, 'Recruitment Officer', 105, 3, 'MCG', 'Staff recruitment'),
(131, 'Training Coordinator', 105, 3, 'MCG', 'Staff training programs'),
(132, 'Administrative Assistants', 105, 3, 'MCG', 'Administrative support'),

-- Level 3 - Under Joint Commissioner - Taxation
(133, 'Tax Assessors', 106, 3, 'MCG', 'Tax assessment'),
(134, 'Revenue Inspectors', 106, 3, 'MCG', 'Revenue inspection'),
(135, 'Tax Recovery Officers', 106, 3, 'MCG', 'Tax collection'),
(136, 'Tax Clerks and Support Staff', 106, 3, 'MCG', 'Administrative support'),

-- Level 3 - Under Joint Commissioner - IT
(137, 'Software Developers', 107, 3, 'MCG', 'Software development'),
(138, 'Cybersecurity Specialists', 107, 3, 'MCG', 'IT security'),
(139, 'Network Administrators', 107, 3, 'MCG', 'Network management'),
(140, 'IT Support Technicians', 107, 3, 'MCG', 'Technical support'),

-- Level 3 - Under Joint Commissioner - Legal
(141, 'Legal Advisors', 108, 3, 'MCG', 'Legal counsel'),
(142, 'Legal Assistants', 108, 3, 'MCG', 'Legal support'),
(143, 'Litigation Officers', 108, 3, 'MCG', 'Court proceedings'),
(144, 'Clerical Support', 108, 3, 'MCG', 'Administrative support'),

-- Level 3 - Under Department Heads
(145, 'Audit Department Head and Staff', 109, 3, 'MCG', 'Audit operations'),
(146, 'Estate Department Head and Staff', 109, 3, 'MCG', 'Property management'),
(147, 'Corporate Social Responsibility (CSR) Head and Coordinators', 109, 3, 'MCG', 'CSR activities'),
(148, 'Parks & Horticulture Head and Gardeners', 109, 3, 'MCG', 'Parks maintenance'),
(149, 'Water Supply & Sewerage Supervisors and Field Staff', 109, 3, 'MCG', 'Water infrastructure'),

-- Level 4 - Under Zonal Joint Commissioners
(150, 'Executive Engineers (Civil, PH, Electrical)', 116, 4, 'MCG', 'Zone-level engineering'),
(151, 'Assistant Executive Engineers', 116, 4, 'MCG', 'Assistant engineers'),
(152, 'Junior Engineers (Civil, PH, Electrical)', 116, 4, 'MCG', 'Field engineers'),
(153, 'Site Inspectors / Technicians', 116, 4, 'MCG', 'Site supervision'),
(154, 'Sanitary Inspectors', 116, 4, 'MCG', 'Zone sanitation'),
(155, 'Health Officers', 116, 4, 'MCG', 'Public health'),

-- Level 4 - Under Chief Town Planner
(156, 'Senior Town Planner', 117, 4, 'MCG', 'Sanjeev Maan'),
(157, 'Junior Town Planners', 117, 4, 'MCG', 'Planning staff'),
(158, 'Planning Assistants', 117, 4, 'MCG', 'Planning support'),

-- Level 4 - Under Chief Sanitation Officer
(159, 'Sanitary Inspectors', 118, 4, 'MCG', 'Sanitation inspection'),
(160, 'Sanitary Workers', 118, 4, 'MCG', 'Ground-level cleaning'),

-- Level 4 - Under Chief Engineer - Civil
(161, 'Superintending Engineer - Civil', 119, 4, 'MCG', 'Satyawan Singh'),

-- Level 5 - Under Superintending Engineer - Civil
(162, 'Executive Engineer-HQ', 161, 5, 'MCG', 'Pankaj Saini'),
(163, 'Executive Engineer-I to VIII (Named Roles)', 161, 5, 'MCG', 'Field executive engineers'),
(164, 'Assistant Executive Engineers', 161, 5, 'MCG', 'Assistant engineers'),
(165, 'Junior Engineers', 161, 5, 'MCG', 'Field engineers'),
(166, 'Site Inspectors / Technicians', 161, 5, 'MCG', 'Site supervision'),

-- Level 4 - Under Chief Engineer - Public Health
(167, 'Executive Engineers - Public Health', 120, 4, 'MCG', 'PH engineering'),
(168, 'Assistant Executive Engineers', 120, 4, 'MCG', 'Assistant PH engineers'),
(169, 'Junior Engineers', 120, 4, 'MCG', 'Field PH engineers'),
(170, 'Field Health Inspectors', 120, 4, 'MCG', 'Health inspection'),

-- Level 4 - Under Chief Engineer - Electrical
(171, 'Executive Engineers - Electrical', 121, 4, 'MCG', 'Electrical engineering'),
(172, 'Junior Engineers - Electrical', 121, 4, 'MCG', 'Field electrical engineers'),
(173, 'Electricians / Technicians', 121, 4, 'MCG', 'Electrical maintenance'),

-- Level 4 - Under Fire Services Department
(174, 'Joint Commissioner - Fire Services', 122, 4, 'MCG', 'Fire services head'),
(175, 'Fire Inspectors', 122, 4, 'MCG', 'Fire safety inspection'),
(176, 'Firefighters', 122, 4, 'MCG', 'Emergency response'),
(177, 'Fire Safety Officers', 122, 4, 'MCG', 'Fire safety protocols'),

-- Level 4 - Under Swachh Bharat Mission Department
(178, 'Joint Commissioner - Swachh Bharat', 123, 4, 'MCG', 'Akhilesh Kumar'),
(179, 'Swachh Coordinators', 123, 4, 'MCG', 'Cleanliness coordination'),
(180, 'Waste Auditors', 123, 4, 'MCG', 'Waste management audit'),
(181, 'Waste Management Supervisors', 123, 4, 'MCG', 'Waste supervision'),
(182, 'Street Sanitation Workers', 123, 4, 'MCG', 'Street cleaning');
