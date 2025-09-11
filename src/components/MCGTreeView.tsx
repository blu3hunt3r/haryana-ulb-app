import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Building2, Users, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  organization: string;
  description?: string;
  children?: Department[];
}

interface MCGTreeViewProps {
  departments: Department[];
  onRoleClick: (dept: Department) => void;
}

const MCGTreeView: React.FC<MCGTreeViewProps> = ({ departments, onRoleClick }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([15])); // Start with Mayor Office expanded
  const [searchTerm, setSearchTerm] = useState('');

  // Build proper hierarchy
  const buildHierarchy = (depts: Department[]): Department[] => {
    const deptMap = new Map<number, Department>();
    const roots: Department[] = [];

    // Create map with children arrays
    depts.forEach(dept => {
      deptMap.set(dept.id, { ...dept, children: [] });
    });

    // Build parent-child relationships
    depts.forEach(dept => {
      const deptWithChildren = deptMap.get(dept.id)!;
      
      if (dept.parent_id === null || dept.parent_id === 2) {
        // Root level (Mayor Office, etc.)
        roots.push(deptWithChildren);
      } else {
        const parent = deptMap.get(dept.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(deptWithChildren);
        }
      }
    });

    // Sort children by level and name
    const sortChildren = (dept: Department) => {
      if (dept.children) {
        dept.children.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
        dept.children.forEach(sortChildren);
      }
    };

    roots.forEach(sortChildren);
    return roots.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  };

  // Filter departments based on search
  const filterDepartments = (depts: Department[], term: string): Department[] => {
    if (!term) return depts;
    
    return depts.filter(dept => {
      const matchesSearch = dept.name.toLowerCase().includes(term.toLowerCase()) ||
                           (dept.description && dept.description.toLowerCase().includes(term.toLowerCase()));
      
      const hasMatchingChildren = dept.children && 
        filterDepartments(dept.children, term).length > 0;
      
      if (matchesSearch || hasMatchingChildren) {
        return {
          ...dept,
          children: dept.children ? filterDepartments(dept.children, term) : []
        };
      }
      return false;
    }).map(dept => ({
      ...dept,
      children: dept.children ? filterDepartments(dept.children, term) : []
    }));
  };

  const toggleExpand = (deptId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedNodes(newExpanded);
  };

  const getIcon = (dept: Department) => {
    if (dept.level <= 1) return <Building2 className="w-4 h-4 text-blue-600" />;
    if (dept.level === 2) return <Users className="w-4 h-4 text-green-600" />;
    return <User className="w-4 h-4 text-gray-600" />;
  };

  const getLevelStyle = (level: number) => {
    const baseStyle = "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border-l-4";
    switch (level) {
      case 0:
      case 1:
        return `${baseStyle} border-l-blue-500 bg-blue-50 hover:bg-blue-100`;
      case 2:
        return `${baseStyle} border-l-green-500 bg-green-50 hover:bg-green-100`;
      case 3:
        return `${baseStyle} border-l-orange-500 bg-orange-50 hover:bg-orange-100`;
      default:
        return `${baseStyle} border-l-gray-500 bg-gray-50 hover:bg-gray-100`;
    }
  };

  const renderDepartment = (dept: Department, depth: number = 0) => {
    const isExpanded = expandedNodes.has(dept.id);
    const hasChildren = dept.children && dept.children.length > 0;
    
    return (
      <div key={dept.id} className="mb-1">
        <div 
          style={{ marginLeft: `${depth * 20}px` }}
          className={getLevelStyle(dept.level)}
          onClick={() => onRoleClick(dept)}
        >
          <div 
            className="flex items-center gap-1"
            onClick={(e) => {
              if (hasChildren) {
                e.stopPropagation();
                toggleExpand(dept.id);
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>
          
          {getIcon(dept)}
          
          <div className="flex-1">
            <div className="font-medium text-sm">{dept.name}</div>
            {dept.description && (
              <div className="text-xs text-gray-600 mt-1">{dept.description}</div>
            )}
          </div>
          
          {hasChildren && (
            <Badge variant="secondary" className="text-xs">
              {dept.children?.length} roles
            </Badge>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {dept.children?.map(child => renderDepartment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const hierarchy = buildHierarchy(departments);
  const filteredHierarchy = searchTerm ? filterDepartments(hierarchy, searchTerm) : hierarchy;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          MCG Organizational Structure
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search roles, departments, or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="text-sm text-gray-600">
          Click on any role to view detailed information, responsibilities, and contact details
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Leadership</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm">Departments</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Individual Roles</span>
          </div>
        </div>

        {/* Tree View */}
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filteredHierarchy.length > 0 ? (
            filteredHierarchy.map(dept => renderDepartment(dept))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No roles found matching your search' : 'No organizational data available'}
            </div>
          )}
        </div>

        {/* Expand All / Collapse All */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={() => {
              const allIds = new Set<number>();
              const collectIds = (depts: Department[]) => {
                depts.forEach(dept => {
                  allIds.add(dept.id);
                  if (dept.children) collectIds(dept.children);
                });
              };
              collectIds(filteredHierarchy);
              setExpandedNodes(allIds);
            }}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedNodes(new Set([15]))} // Keep only Mayor Office expanded
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MCGTreeView;
