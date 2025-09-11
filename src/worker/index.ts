/**
 * Cloudflare Worker for Haryana ULB API
 * Handles RESTful API endpoints with D1 database and KV caching
 */

interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ASSETS: R2Bucket;
}

interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  organization: string;
  description: string;
  children?: Department[];
}

interface Role {
  id: number;
  title: string;
  department_id: number;
  description: string;
  is_leadership: boolean;
}

interface Personnel {
  id: number;
  name: string;
  role_id: number;
  contact: string;
  email: string;
  is_elected: boolean;
  role_title?: string;
  department_name?: string;
}

interface Ward {
  id: number;
  ward_number: number;
  zone_id: number;
  councillor_id: number;
  area_description: string;
  population: number;
  councillor_name?: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Cache TTL (24 hours)
const CACHE_TTL = 24 * 60 * 60;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (pathname.startsWith('/api/')) {
        const response = await handleApiRequest(pathname, searchParams, env);
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Default response
      return new Response('Haryana ULB API', {
        headers: { 'Content-Type': 'text/plain', ...corsHeaders },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

async function handleApiRequest(
  pathname: string,
  searchParams: URLSearchParams,
  env: Env
): Promise<any> {
  const path = pathname.replace('/api', '');

  switch (path) {
    case '/ulb/structure':
      return getULBStructure(env);
    case '/mcg/wards':
      return getMCGWards(env);
    case '/gmda/divisions':
      return getGMDADivisions(env);
    case '/search':
      const query = searchParams.get('query');
      if (!query) {
        throw new Error('Query parameter is required');
      }
      return searchRolesPersonnel(query, env);
    case '/departments':
      return getAllDepartments(env);
    case '/personnel':
      return getAllPersonnel(env);
    default:
      // Handle dynamic routes
      if (path.startsWith('/role-details/')) {
        const roleId = path.split('/')[2];
        return getRoleDetails(parseInt(roleId), env);
      }
      if (path.startsWith('/contact-info/')) {
        const roleId = path.split('/')[2];
        return getContactInfo(parseInt(roleId), env);
      }
      if (path === '/grievance-categories') {
        return getGrievanceCategories(env);
      }
      if (path === '/rts-services') {
        return getRTSServices(env);
      }
      throw new Error('Endpoint not found');
  }
}

async function getULBStructure(env: Env): Promise<any> {
  const cacheKey = 'ulb-structure';
  
  // Check cache first
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const { results } = await env.DB.prepare(`
    SELECT d.*, COUNT(c.id) as child_count
    FROM departments d
    LEFT JOIN departments c ON c.parent_id = d.id
    WHERE d.organization = 'ULB'
    GROUP BY d.id
    ORDER BY d.level, d.name
  `).all();

  const departments = results as Department[];
  const structure = buildHierarchy(departments);

  // Cache the result
  await env.CACHE.put(cacheKey, JSON.stringify(structure), {
    expirationTtl: CACHE_TTL,
  });

  return structure;
}

async function getMCGWards(env: Env): Promise<any> {
  const cacheKey = 'mcg-wards';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT w.*, p.name as councillor_name
    FROM wards w
    LEFT JOIN personnel p ON p.id = w.councillor_id
    ORDER BY w.ward_number
  `).all();

  const wards = results as Ward[];

  await env.CACHE.put(cacheKey, JSON.stringify(wards), {
    expirationTtl: CACHE_TTL,
  });

  return wards;
}

async function getGMDADivisions(env: Env): Promise<any> {
  const cacheKey = 'gmda-divisions';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT d.*, r.title as head_role, p.name as head_name
    FROM departments d
    LEFT JOIN roles r ON r.department_id = d.id AND r.is_leadership = 1
    LEFT JOIN personnel p ON p.role_id = r.id
    WHERE d.organization = 'GMDA' AND d.level = 2
    ORDER BY d.name
  `).all();

  const divisions = results;

  await env.CACHE.put(cacheKey, JSON.stringify(divisions), {
    expirationTtl: CACHE_TTL,
  });

  return divisions;
}

async function searchRolesPersonnel(query: string, env: Env): Promise<any> {
  const cacheKey = `search-${query.toLowerCase()}`;
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const searchTerm = `%${query}%`;
  
  // Search in roles and personnel
  const { results: roleResults } = await env.DB.prepare(`
    SELECT r.*, d.name as department_name, d.organization
    FROM roles r
    JOIN departments d ON d.id = r.department_id
    WHERE r.title LIKE ? OR r.description LIKE ?
    ORDER BY r.is_leadership DESC, r.title
    LIMIT 20
  `).bind(searchTerm, searchTerm).all();

  const { results: personnelResults } = await env.DB.prepare(`
    SELECT p.*, r.title as role_title, d.name as department_name, d.organization
    FROM personnel p
    JOIN roles r ON r.id = p.role_id
    JOIN departments d ON d.id = r.department_id
    WHERE p.name LIKE ? OR r.title LIKE ?
    ORDER BY p.is_elected DESC, p.name
    LIMIT 20
  `).bind(searchTerm, searchTerm).all();

  const searchResults = {
    roles: roleResults,
    personnel: personnelResults,
    total: (roleResults?.length || 0) + (personnelResults?.length || 0),
  };

  await env.CACHE.put(cacheKey, JSON.stringify(searchResults), {
    expirationTtl: CACHE_TTL,
  });

  return searchResults;
}

async function getAllDepartments(env: Env): Promise<any> {
  const cacheKey = 'all-departments';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT * FROM departments
    ORDER BY organization, level, name
  `).all();

  await env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL,
  });

  return results;
}

async function getAllPersonnel(env: Env): Promise<any> {
  const cacheKey = 'all-personnel';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT p.*, r.title as role_title, d.name as department_name, d.organization
    FROM personnel p
    JOIN roles r ON r.id = p.role_id
    JOIN departments d ON d.id = r.department_id
    ORDER BY d.organization, p.is_elected DESC, p.name
  `).all();

  await env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL,
  });

  return results;
}

function buildHierarchy(departments: Department[]): Department[] {
  const departmentMap = new Map<number, Department>();
  const roots: Department[] = [];

  // Create map of all departments
  departments.forEach(dept => {
    departmentMap.set(dept.id, { ...dept, children: [] });
  });

  // Build hierarchy
  departments.forEach(dept => {
    const department = departmentMap.get(dept.id)!;
    
    if (dept.parent_id === null) {
      roots.push(department);
    } else {
      const parent = departmentMap.get(dept.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(department);
      }
    }
  });

  return roots;
}

async function getRoleDetails(roleId: number, env: Env): Promise<any> {
  const cacheKey = `role-details-${roleId}`;
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT * FROM role_details WHERE role_id = ?
  `).bind(roleId).all();

  const roleDetail = results[0] || null;

  await env.CACHE.put(cacheKey, JSON.stringify(roleDetail), {
    expirationTtl: CACHE_TTL,
  });

  return roleDetail;
}

async function getContactInfo(roleId: number, env: Env): Promise<any> {
  const cacheKey = `contact-info-${roleId}`;
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT ci.* FROM contact_information ci
    JOIN roles r ON r.department_id = ci.department_id
    WHERE r.id = ?
  `).bind(roleId).all();

  const contactInfo = results[0] || null;

  await env.CACHE.put(cacheKey, JSON.stringify(contactInfo), {
    expirationTtl: CACHE_TTL,
  });

  return contactInfo;
}

async function getGrievanceCategories(env: Env): Promise<any> {
  const cacheKey = 'grievance-categories';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT gc.*, d.name as department_name 
    FROM grievance_categories gc
    LEFT JOIN departments d ON d.id = gc.department_id
    ORDER BY gc.category_name
  `).all();

  await env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL,
  });

  return results;
}

async function getRTSServices(env: Env): Promise<any> {
  const cacheKey = 'rts-services';
  
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const { results } = await env.DB.prepare(`
    SELECT rts.*, d.name as department_name 
    FROM rts_services rts
    LEFT JOIN departments d ON d.id = rts.department_id
    ORDER BY rts.timeline_days, rts.service_name
  `).all();

  await env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL,
  });

  return results;
}
