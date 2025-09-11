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
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([15, 16])); // Start with Mayor Office and Municipal Commissioner expanded
  const [searchTerm, setSearchTerm] = useState('');

  // Build proper nested hierarchy with correct parent-child relationships
  const buildProperHierarchy = (depts: Department[]): Department[] => {
    console.log('Building hierarchy from departments:', depts.map(d => ({
      id: d.id, 
      name: d.name, 
      parent_id: d.parent_id, 
      level: d.level
    })));

    const deptMap = new Map<number, Department>();
    
    // Create map with children arrays initialized
    depts.forEach(dept => {
      deptMap.set(dept.id, { ...dept, children: [] });
    });

    // Find the actual root (Mayor Office should be level 1, parent_id = 2)
    const mayorOffice = depts.find(d => d.name?.includes('Mayor Office'));
    const municipalCommissioner = depts.find(d => d.name?.includes('Municipal Commissioner'));
    
    console.log('Found Mayor Office:', mayorOffice);
    console.log('Found Municipal Commissioner:', municipalCommissioner);

    // Build the hierarchy by connecting children to parents
    depts.forEach(dept => {
      const currentDept = deptMap.get(dept.id)!;
      
      // Find all departments that should be children of this department
      depts.forEach(potentialChild => {
        if (potentialChild.parent_id === dept.id) {
          const childDept = deptMap.get(potentialChild.id)!;
          currentDept.children = currentDept.children || [];
          currentDept.children.push(childDept);
        }
      });
    });

    // Sort all children recursively
    const sortChildrenRecursively = (dept: Department) => {
      if (dept.children && dept.children.length > 0) {
        dept.children.sort((a, b) => {
          // Sort by level first, then by name
          if (a.level !== b.level) return a.level - b.level;
          return a.name.localeCompare(b.name);
        });
        dept.children.forEach(sortChildrenRecursively);
      }
    };

    // Create the root structure - start with departments that have parent_id = 2 (the MCG org)
    const rootDepartments = depts
      .filter(d => d.parent_id === 2) // These are direct children of MCG organization
      .map(d => deptMap.get(d.id)!)
      .sort((a, b) => {
        // Mayor Office should come first, then Municipal Commissioner
        if (a.name?.includes('Mayor')) return -1;
        if (b.name?.includes('Mayor')) return 1;
        if (a.name?.includes('Municipal Commissioner')) return -1;
        if (b.name?.includes('Municipal Commissioner')) return 1;
        return a.level - b.level || a.name.localeCompare(b.name);
      });

    // Sort all children recursively
    rootDepartments.forEach(sortChildrenRecursively);

    console.log('Built hierarchy roots:', rootDepartments.map(d => ({
      name: d.name,
      children: d.children?.length || 0
    })));

    return rootDepartments;
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
        {/* Department/Role Row */}
        <div 
          className={`${getLevelStyle(dept.level)} relative`}
          style={{ marginLeft: `${depth * 24}px` }}
          onClick={() => onRoleClick(dept)}
        >
          {/* Hierarchy Lines */}
          {depth > 0 && (
            <>
              {/* Vertical line from parent */}
              <div 
                className="absolute border-l-2 border-gray-300"
                style={{
                  left: `${-12}px`,
                  top: '-8px',
                  height: '20px',
                  width: '1px'
                }}
              />
              {/* Horizontal line to item */}
              <div 
                className="absolute border-t-2 border-gray-300"
                style={{
                  left: `${-12}px`,
                  top: '12px',
                  width: '12px',
                  height: '1px'
                }}
              />
            </>
          )}

          {/* Expand/Collapse Button */}
          <div 
            className="flex items-center gap-1 mr-2"
            onClick={(e) => {
              if (hasChildren) {
                e.stopPropagation();
                toggleExpand(dept.id);
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>
          
          {/* Role Icon */}
          {getIcon(dept)}
          
          {/* Role Information */}
          <div className="flex-1 ml-2">
            <div className={`font-medium text-sm ${depth === 0 ? 'text-blue-800 font-bold' : depth === 1 ? 'text-green-700 font-semibold' : 'text-gray-800'}`}>
              {dept.name}
            </div>
            {dept.description && (
              <div className="text-xs text-gray-600 mt-1">{dept.description}</div>
            )}
          </div>
          
          {/* Children Count Badge */}
          {hasChildren && (
            <Badge variant="secondary" className="text-xs ml-2">
              {dept.children?.length} {dept.children?.length === 1 ? 'role' : 'roles'}
            </Badge>
          )}
        </div>
        
        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="relative">
            {/* Extended vertical line for children */}
            {depth >= 0 && (
              <div 
                className="absolute border-l-2 border-gray-300"
                style={{
                  left: `${depth * 24 + 12}px`,
                  top: '0px',
                  height: '100%',
                  width: '1px'
                }}
              />
            )}
            <div className="mt-1">
              {dept.children?.map((child, index) => (
                <div key={child.id} className="relative">
                  {renderDepartment(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const hierarchy = buildProperHierarchy(departments);
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
            onClick={() => setExpandedNodes(new Set([15, 16]))} // Keep Mayor Office and Municipal Commissioner expanded
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
