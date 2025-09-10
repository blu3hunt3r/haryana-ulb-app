-- Haryana ULB Database Schema

-- Departments table for organizational hierarchy
CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  level INTEGER NOT NULL DEFAULT 0,
  organization TEXT NOT NULL, -- 'ULB', 'MCG', 'GMDA', 'WARD'
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES departments(id)
);

-- Roles table for positions within departments
CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  department_id INTEGER,
  description TEXT,
  is_leadership BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Personnel table for individuals in roles
CREATE TABLE personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role_id INTEGER,
  contact TEXT,
  email TEXT,
  is_elected BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Wards table for ward-specific information
CREATE TABLE wards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward_number INTEGER NOT NULL UNIQUE,
  zone_id INTEGER,
  councillor_id INTEGER,
  area_description TEXT,
  population INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (councillor_id) REFERENCES personnel(id)
);

-- Indexes for better performance
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_departments_org ON departments(organization);
CREATE INDEX idx_roles_dept ON roles(department_id);
CREATE INDEX idx_personnel_role ON personnel(role_id);
CREATE INDEX idx_wards_councillor ON wards(councillor_id);
