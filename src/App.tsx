import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import SearchBar from './components/SearchBar';
import OrgChart from './components/OrgChart';
import { 
  Building2, 
  Users, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  Home,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  level: number;
  organization: string;
  description: string;
  children?: Department[];
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

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://haryana-ulb-worker.your-subdomain.workers.dev'
  : 'http://localhost:8787';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ulb" element={<ULBPage />} />
            <Route path="/mcg" element={<MCGPage />} />
            <Route path="/gmda" element={<GMDAPage />} />
            <Route path="/wards" element={<WardsPage />} />
            <Route path="/wards/:id" element={<WardDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Header: React.FC<{
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ulb', label: 'ULB Dept', icon: Building2 },
    { path: '/mcg', label: 'MCG', icon: Users },
    { path: '/gmda', label: 'GMDA', icon: Building2 },
    { path: '/wards', label: 'Wards', icon: MapPin },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Haryana ULB</h1>
                <p className="text-xs text-gray-500">Organizational Structure</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="py-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Haryana Urban Local Bodies
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the organizational structure of Haryana's Urban Local Bodies, 
          including the Municipal Corporation of Gurugram (MCG), Gurugram Metropolitan 
          Development Authority (GMDA), and ward-level governance.
        </p>
      </div>

      <div className="mb-8">
        <SearchBar apiEndpoint={`${API_BASE}/api/search`} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OrganizationCard
          title="ULB Department"
          description="State-level urban governance"
          icon={Building2}
          color="bg-gradient-to-r from-blue-600 to-blue-800"
          link="/ulb"
          stats="93 Urban Bodies"
        />
        <OrganizationCard
          title="MCG"
          description="Municipal Corporation Gurugram"
          icon={Users}
          color="bg-gradient-to-r from-green-600 to-green-800"
          link="/mcg"
          stats="Multiple Departments"
        />
        <OrganizationCard
          title="GMDA"
          description="Metropolitan Development Authority"
          icon={Building2}
          color="bg-gradient-to-r from-red-600 to-red-800"
          link="/gmda"
          stats="7 Functional Divisions"
        />
        <OrganizationCard
          title="Ward System"
          description="36 Ward governance structure"
          icon={MapPin}
          color="bg-gradient-to-r from-purple-600 to-purple-800"
          link="/wards"
          stats="36 Wards"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About This Application</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            This application provides a comprehensive view of the organizational structure 
            of Haryana's Urban Local Bodies. It includes detailed hierarchies, role definitions, 
            and personnel information across different levels of governance.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">State Level</h3>
              <p className="text-sm text-gray-600">ULB Department oversight</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Municipal Level</h3>
              <p className="text-sm text-gray-600">MCG and GMDA operations</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Ward Level</h3>
              <p className="text-sm text-gray-600">Local governance structure</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const OrganizationCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  link: string;
  stats: string;
}> = ({ title, description, icon: Icon, color, link, stats }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className={`text-white ${color}`}>
        <div className="flex items-center justify-between">
          <Icon className="w-8 h-8" />
          <Badge variant="secondary">{stats}</Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 mb-4">{description}</p>
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-gray-50"
          onClick={() => window.location.href = link}
        >
          View Structure
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Placeholder components for other pages
const ULBPage: React.FC = () => {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchULBData();
  }, []);

  const fetchULBData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ulb/structure`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching ULB data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading ULB structure...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Urban Local Bodies Department
        </h1>
        <p className="text-gray-600">State-level governance structure for urban areas</p>
      </div>
      <OrgChart 
        data={data}
        organization="ULB"
        title="Haryana ULB Department Structure"
        description="Complete organizational hierarchy of the state ULB department"
      />
    </div>
  );
};

const MCGPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Municipal Corporation of Gurugram
      </h1>
      <p className="text-gray-600">MCG organizational structure coming soon...</p>
    </div>
  );
};

const GMDAPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Gurugram Metropolitan Development Authority
      </h1>
      <p className="text-gray-600">GMDA structure coming soon...</p>
    </div>
  );
};

const WardsPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Ward System (36 Wards)
      </h1>
      <p className="text-gray-600">Ward-level governance structure coming soon...</p>
    </div>
  );
};

const WardDetailPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Ward Details
      </h1>
      <p className="text-gray-600">Ward detail page coming soon...</p>
    </div>
  );
};

const SearchPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Organizational Structure
        </h1>
        <p className="text-gray-600">Find roles, personnel, and departments across all organizations</p>
      </div>
      <SearchBar apiEndpoint={`${API_BASE}/api/search`} />
    </div>
  );
};

const PersonnelPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Personnel Directory
      </h1>
      <p className="text-gray-600">Complete personnel directory coming soon...</p>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Haryana ULB</h3>
            <p className="text-gray-400">
              Comprehensive organizational structure of Haryana's Urban Local Bodies
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/ulb" className="hover:text-white">ULB Department</a></li>
              <li><a href="/mcg" className="hover:text-white">MCG</a></li>
              <li><a href="/gmda" className="hover:text-white">GMDA</a></li>
              <li><a href="/wards" className="hover:text-white">Ward System</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91-XXX-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@haryanaULB.gov.in</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Government of Haryana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default App;
