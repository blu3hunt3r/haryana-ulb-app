import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import RoleDetailModal from './RoleDetailModal';
import MCGTreeView from './MCGTreeView';
import {
  Building2,
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  HelpCircle,
  Scale,
  Shield
} from 'lucide-react';

interface Role {
  id: number;
  title: string;
  description: string;
  department_name: string;
  is_leadership: boolean;
}

interface Personnel {
  id: number;
  name: string;
  role_title: string;
  department_name: string;
  organization: string;
  contact: string;
  email: string;
  is_elected: boolean;
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

const API_BASE = 'https://haryana-ulb-worker.arunyadav17895.workers.dev';

const MCGPage: React.FC = () => {
  const [mcgData, setMcgData] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMCGData();
  }, []);

  const fetchMCGData = async () => {
    try {
      setLoading(true);
      const [deptResponse, rolesResponse, personnelResponse] = await Promise.all([
        fetch(`${API_BASE}/api/departments`),
        fetch(`${API_BASE}/api/search?query=MCG`),
        fetch(`${API_BASE}/api/personnel`)
      ]);

      if (deptResponse.ok) {
        const allDepts = await deptResponse.json();
        // Filter MCG departments - no need for complex hierarchy building anymore
        const mcgDepts = allDepts.filter((d: Department) => d.organization === 'MCG');
        setMcgData(mcgDepts);
      }

      if (rolesResponse.ok) {
        const searchResults = await rolesResponse.json();
        setRoles(searchResults.roles || []);
      }

      if (personnelResponse.ok) {
        const allPersonnel = await personnelResponse.json();
        const mcgPersonnel = allPersonnel.filter((p: Personnel) => p.organization === 'MCG');
        setPersonnel(mcgPersonnel);
      }
    } catch (error) {
      console.error('Error fetching MCG data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (department: Department) => {
    // Create a role object from department data - EVERY role should open a modal
    const role: Role = {
      id: department.id,
      title: department.name,
      description: department.description || `${department.name} - ${department.organization} Department`,
      department_name: department.name,
      is_leadership: department.level <= 2
    };

    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const getPersonnelByRole = (roleTitle: string) => {
    return personnel.find(p => p.role_title.toLowerCase().includes(roleTitle.toLowerCase()));
  };



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Municipal Corporation of Gurugram (MCG)
          </h1>
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner mr-2"></div>
            Loading MCG organizational structure...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-2">
          Municipal Corporation of Gurugram
        </h1>
        <p className="text-xl opacity-90 mb-4">
          Complete organizational hierarchy with role details, grievance mechanisms, and Right to Service Act
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {roles.length} Roles Defined
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {personnel.length} Key Personnel
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Right to Service Act Compliant
          </Badge>
        </div>
      </div>

      {/* Emergency Helplines */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency & Helpline Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-red-100 rounded-lg">
              <div className="font-bold text-red-800 text-lg">101</div>
              <div className="text-red-700">Fire Emergency</div>
            </div>
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <div className="font-bold text-blue-800 text-lg">0124-WATER-24</div>
              <div className="text-blue-700">Water Issues</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="font-bold text-green-800 text-lg">0124-CLEAN-UP</div>
              <div className="text-green-700">Sanitation</div>
            </div>
            <div className="text-center p-3 bg-orange-100 rounded-lg">
              <div className="font-bold text-orange-800 text-lg">0124-ROAD-FIX</div>
              <div className="text-orange-700">Road Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Organizational Tree View */}
      <MCGTreeView 
        departments={mcgData}
        onRoleClick={handleDepartmentClick}
      />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              File Grievance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 text-sm mb-4">
              Report issues or complaints through multiple channels
            </p>
            <div className="space-y-2 text-sm">
              <p>• Online: grievance.mcgurugram.gov.in</p>
              <p>• CM Window: cmwindow.haryana.gov.in</p>
              <p>• Phone: 0124-MCG-HELP</p>
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              File Online Grievance
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Right to Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 text-sm mb-4">
              Guaranteed service delivery timelines under RTS Act
            </p>
            <div className="space-y-2 text-sm">
              <p>• Property Tax: 15 days</p>
              <p>• Building Approval: 30 days</p>
              <p>• Water Connection: 15 days</p>
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              View All Services
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Visit MCG Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 text-sm mb-4">
              Main office location and visiting hours
            </p>
            <div className="space-y-2 text-sm">
              <p>MCG Building, Sector 34, Gurugram</p>
              <p>Office Hours: 9:00 AM - 6:00 PM</p>
              <p>Public Dealing: 10:00 AM - 5:00 PM</p>
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right to Service Act Information */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Haryana Right to Service Act, 2014
          </CardTitle>
          <CardDescription>
            Your rights as a citizen for guaranteed service delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">Your Rights</h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Right to receive services within specified timelines</li>
                <li>• Right to appeal if service is delayed or denied</li>
                <li>• Right to compensation for unreasonable delays</li>
                <li>• Right to transparent and accountable service delivery</li>
                <li>• Right to track your application status online</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-3">How to Appeal</h4>
              <ol className="space-y-2 text-sm text-purple-700">
                <li>1. First appeal to designated officer's supervisor</li>
                <li>2. Second appeal to appellate authority</li>
                <li>3. Approach State Information Commission</li>
                <li>4. File complaint with Lokayukta if needed</li>
                <li>5. Legal remedy through High Court</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Detail Modal */}
      <RoleDetailModal
        role={selectedRole}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiEndpoint={API_BASE}
      />
    </div>
  );
};

export default MCGPage;
