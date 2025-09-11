import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronRight, Users, Building2, MapPin } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  organization: string;
  description: string;
  children?: Department[];
}

interface OrgChartProps {
  data: Department[];
  organization: 'ULB' | 'MCG' | 'GMDA' | 'WARD';
  title: string;
  description?: string;
  onNodeClick?: (nodeId: number, nodeName: string) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({ data, organization, title, description, onNodeClick }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([1])); // Expand root by default
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#1e40af',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#e5e7eb',
        background: '#ffffff',
        mainBkg: '#3b82f6',
        secondBkg: '#10b981',
        tertiaryBkg: '#f59e0b'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 10,
      },
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });
  }, []);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      renderChart();
    }
  }, [data, expandedNodes]);

  const renderChart = async () => {
    if (!chartRef.current || data.length === 0) return;

    setIsLoading(true);
    
    try {
      const mermaidSyntax = generateMermaidSyntax(data);
      chartRef.current.innerHTML = `<div class="mermaid">${mermaidSyntax}</div>`;
      
      await mermaid.run({
        querySelector: '.mermaid',
      });

      // Add click handlers for interactivity
      addClickHandlers();
    } catch (error) {
      console.error('Error rendering chart:', error);
      chartRef.current.innerHTML = '<div class="text-red-500 p-4">Error rendering organizational chart</div>';
    } finally {
      setIsLoading(false);
    }
  };

  const generateMermaidSyntax = (departments: Department[]): string => {
    const hierarchy = buildHierarchy(departments);
    let syntax = 'graph TD\n';
    
    const processNode = (dept: Department, level: number = 0): void => {
      const nodeId = `node${dept.id}`;
      const isExpanded = expandedNodes.has(dept.id);
      const hasChildren = dept.children && dept.children.length > 0;
      
      // Node styling based on organization and level
      let nodeClass = 'default';
      if (dept.organization === 'ULB' && level === 0) nodeClass = 'ulb-root';
      else if (dept.organization === 'MCG' && level <= 1) nodeClass = 'mcg-head';
      else if (dept.organization === 'GMDA' && level <= 1) nodeClass = 'gmda-head';
      else if (dept.organization === 'WARD') nodeClass = 'ward-node';
      else if (level === 1) nodeClass = 'dept-head';
      else if (level === 2) nodeClass = 'sub-dept';

      // Create node with appropriate shape and text
      const nodeText = hasChildren && !isExpanded ? 
        `${dept.name} [+${dept.children?.length || 0}]` : 
        dept.name;
      
      syntax += `    ${nodeId}["${nodeText}"]\n`;
      syntax += `    class ${nodeId} ${nodeClass}\n`;

      // Add children if expanded
      if (isExpanded && dept.children) {
        dept.children.forEach(child => {
          const childId = `node${child.id}`;
          syntax += `    ${nodeId} --> ${childId}\n`;
          processNode(child, level + 1);
        });
      }
    };

    hierarchy.forEach(dept => processNode(dept));

    // Add styling classes
    syntax += `
    classDef ulb-root fill:#1e40af,stroke:#1e3a8a,stroke-width:3px,color:#fff
    classDef mcg-head fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
    classDef gmda-head fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff
    classDef ward-node fill:#7c3aed,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef dept-head fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef sub-dept fill:#0891b2,stroke:#0e7490,stroke-width:1px,color:#fff
    classDef default fill:#6b7280,stroke:#4b5563,stroke-width:1px,color:#fff
    `;

    return syntax;
  };

  const buildHierarchy = (departments: Department[]): Department[] => {
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
  };

  const addClickHandlers = () => {
    // Add click handlers to nodes for expand/collapse and detail view
    const nodes = chartRef.current?.querySelectorAll('.node');
    nodes?.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = parseInt(node.id.replace('node', ''));
        const nodeName = node.textContent?.replace(/\s*\[.*?\]$/, '') || '';
        
        // If onNodeClick is provided, call it (for role details)
        if (onNodeClick && organization === 'MCG') {
          onNodeClick(nodeId, nodeName);
        } else {
          // Otherwise, toggle node expansion
          toggleNode(nodeId);
        }
      });
    });
  };

  const toggleNode = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getOrganizationIcon = () => {
    switch (organization) {
      case 'ULB': return <Building2 className="w-5 h-5" />;
      case 'MCG': return <Users className="w-5 h-5" />;
      case 'GMDA': return <Building2 className="w-5 h-5" />;
      case 'WARD': return <MapPin className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const getOrganizationColor = () => {
    switch (organization) {
      case 'ULB': return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'MCG': return 'bg-gradient-to-r from-green-600 to-green-800';
      case 'GMDA': return 'bg-gradient-to-r from-red-600 to-red-800';
      case 'WARD': return 'bg-gradient-to-r from-purple-600 to-purple-800';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className={`text-white ${getOrganizationColor()}`}>
        <CardTitle className="flex items-center gap-2">
          {getOrganizationIcon()}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {data.length} departments
          </Badge>
        </CardTitle>
        {description && (
          <CardDescription className="text-white/90">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedNodes(new Set([1]))}
          >
            Collapse All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allIds = new Set(data.map(d => d.id));
              setExpandedNodes(allIds);
            }}
          >
            Expand All
          </Button>
        </div>
        
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="loading-spinner"></div>
              <span className="ml-2">Loading organizational chart...</span>
            </div>
          )}
          <div 
            ref={chartRef} 
            className="chart-container p-4 min-h-[400px]"
            style={{ fontSize: '14px' }}
          />
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Leadership</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Departments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>Sub-divisions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>Support Units</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgChart;
