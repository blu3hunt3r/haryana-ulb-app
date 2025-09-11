-- Fix MCG hierarchy structure to match proper organizational flow
-- Mayor Office and Municipal Commissioner Office should be at top level
-- Additional Commissioners should report to Municipal Commissioner
-- Departments should report to appropriate Additional Commissioners

-- Update Additional Commissioners to report to Municipal Commissioner Office (id=16)
UPDATE departments 
SET parent_id = 16 
WHERE organization = 'MCG' 
AND name IN (
  'Additional Commissioner I (Revenue)',
  'Additional Commissioner II (Operations)'
);

-- Update Joint Commissioners to report to Municipal Commissioner Office (id=16)
UPDATE departments 
SET parent_id = 16 
WHERE organization = 'MCG' 
AND name IN (
  'Joint Commissioner - Administration',
  'Joint Commissioner - Taxation', 
  'Joint Commissioner - IT',
  'Joint Commissioner - Legal'
);

-- Update Chief Accounts Officer to report to Municipal Commissioner Office (id=16)
UPDATE departments 
SET parent_id = 16 
WHERE organization = 'MCG' 
AND name = 'Chief Accounts Officer';

-- Update department heads to report to Additional Commissioner II (Operations) (id=18)
UPDATE departments 
SET parent_id = 18 
WHERE organization = 'MCG' 
AND name IN (
  'Engineering Departments',
  'Fire Services Department',
  'Sanitation Department', 
  'Swachh Bharat Mission Department',
  'Town Planning Department'
);

-- Update revenue-related departments to report to Additional Commissioner I (Revenue) (id=17)
UPDATE departments 
SET parent_id = 17 
WHERE organization = 'MCG' 
AND (
  name LIKE '%Tax%' OR 
  name LIKE '%Revenue%' OR 
  name LIKE '%Assessment%'
)
AND parent_id = 2;
