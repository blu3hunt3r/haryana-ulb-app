import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  User,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  ArrowUp,
  ExternalLink,
  Scale,
  HelpCircle,
  Calendar,
  IndianRupee,
  Shield
} from 'lucide-react';

interface RoleDetail {
  id: number;
  responsibilities: string;
  reporting_to: string;
  escalation_process: string;
  grievance_contact: string;
  service_standards: string;
  rts_timeline: number;
}

interface GrievanceCategory {
  id: number;
  category_name: string;
  escalation_level_1: string;
  escalation_level_2: string;
  escalation_level_3: string;
  rts_timeline: number;
  helpline_number: string;
}

interface RTSService {
  id: number;
  service_name: string;
  designated_officer: string;
  timeline_days: number;
  documents_required: string;
  fee_amount: number;
  penalty_amount: number;
  appellate_authority: string;
}

interface ContactInfo {
  id: number;
  office_name: string;
  address: string;
  phone_numbers: string;
  email: string;
  office_hours: string;
  public_dealing_hours: string;
  emergency_number: string;
  website: string;
}

interface Role {
  id: number;
  title: string;
  description: string;
  department_name: string;
  is_leadership: boolean;
}

interface RoleDetailModalProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint?: string;
}

const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  isOpen,
  onClose,
  apiEndpoint = 'https://haryana-ulb-worker.arunyadav17895.workers.dev'
}) => {
  const [roleDetail, setRoleDetail] = useState<RoleDetail | null>(null);
  const [grievanceCategories, setGrievanceCategories] = useState<GrievanceCategory[]>([]);
  const [rtsServices, setRtsServices] = useState<RTSService[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role && isOpen) {
      fetchRoleDetails();
    }
  }, [role, isOpen]);

  const fetchRoleDetails = async () => {
    if (!role) return;
    
    setLoading(true);
    try {
      // Fetch role details, grievance categories, RTS services, and contact info
      const [detailRes, grievanceRes, rtsRes, contactRes] = await Promise.all([
        fetch(`${apiEndpoint}/api/role-details/${role.id}`),
        fetch(`${apiEndpoint}/api/grievance-categories`),
        fetch(`${apiEndpoint}/api/rts-services`),
        fetch(`${apiEndpoint}/api/contact-info/${role.id}`)
      ]);

      if (detailRes.ok) {
        const detail = await detailRes.json();
        setRoleDetail(detail);
      }

      if (grievanceRes.ok) {
        const categories = await grievanceRes.json();
        setGrievanceCategories(categories);
      }

      if (rtsRes.ok) {
        const services = await rtsRes.json();
        setRtsServices(services);
      }

      if (contactRes.ok) {
        const contact = await contactRes.json();
        setContactInfo(contact);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  const formatResponsibilities = (responsibilities: string) => {
    return responsibilities.split('\n').filter(item => item.trim()).map((item, index) => (
      <li key={index} className="mb-2 text-sm">{item.trim()}</li>
    ));
  };

  const formatEscalationProcess = (process: string) => {
    return process.split('\n').filter(item => item.trim()).map((item, index) => (
      <div key={index} className="flex items-center gap-2 mb-2 text-sm">
        <ArrowUp className="w-4 h-4 text-blue-600" />
        {item.trim()}
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {role.title}
            {role.is_leadership && (
              <Badge variant="info" className="ml-2">Leadership</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {role.department_name} • Municipal Corporation of Gurugram
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner mr-2"></div>
            Loading detailed information...
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="responsibilities">Duties</TabsTrigger>
              <TabsTrigger value="escalation">Escalation</TabsTrigger>
              <TabsTrigger value="grievance">Grievance</TabsTrigger>
              <TabsTrigger value="rts">RTS Act</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Role Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  
                  {roleDetail && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Reports To
                        </h4>
                        <p className="text-sm text-gray-600">{roleDetail.reporting_to}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Service Standards
                        </h4>
                        <p className="text-sm text-gray-600">{roleDetail.service_standards}</p>
                      </div>
                    </>
                  )}

                  {contactInfo && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Information
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Office:</strong> {contactInfo.office_name}</p>
                          <p><strong>Address:</strong> {contactInfo.address}</p>
                          <p><strong>Phone:</strong> {contactInfo.phone_numbers}</p>
                          <p><strong>Email:</strong> {contactInfo.email}</p>
                        </div>
                        <div>
                          <p><strong>Office Hours:</strong> {contactInfo.office_hours}</p>
                          <p><strong>Public Hours:</strong> {contactInfo.public_dealing_hours}</p>
                          {contactInfo.emergency_number && (
                            <p><strong>Emergency:</strong> {contactInfo.emergency_number}</p>
                          )}
                          {contactInfo.website && (
                            <p>
                              <strong>Website:</strong>{' '}
                              <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" 
                                 className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                {contactInfo.website}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsibilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Key Responsibilities
                  </CardTitle>
                  <CardDescription>
                    Primary duties and functions of this role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roleDetail?.responsibilities ? (
                    <ul className="list-disc list-inside space-y-1">
                      {formatResponsibilities(roleDetail.responsibilities)}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      Detailed responsibilities information not available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="escalation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Escalation Process
                  </CardTitle>
                  <CardDescription>
                    How to escalate issues if this officer doesn't respond on time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roleDetail?.escalation_process ? (
                    <div className="space-y-3">
                      {formatEscalationProcess(roleDetail.escalation_process)}
                      
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Response Timeline
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          If no response within <strong>{roleDetail.rts_timeline} days</strong>, 
                          escalate to the next level as per Right to Service Act.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Escalation process information not available
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grievance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    How to Report Grievances
                  </CardTitle>
                  <CardDescription>
                    Multiple ways to report complaints and issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Toll-Free Helplines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Emergency & Helpline Numbers
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>MCG Helpline:</strong> <span className="font-mono">0124-MCG-HELP</span></p>
                        <p><strong>Fire Emergency:</strong> <span className="font-mono">101</span></p>
                        <p><strong>Medical Emergency:</strong> <span className="font-mono">108</span></p>
                        <p><strong>Police Emergency:</strong> <span className="font-mono">100</span></p>
                      </div>
                      <div>
                        <p><strong>Water Issues:</strong> <span className="font-mono">0124-WATER-24</span></p>
                        <p><strong>Road Issues:</strong> <span className="font-mono">0124-ROAD-FIX</span></p>
                        <p><strong>Sanitation:</strong> <span className="font-mono">0124-CLEAN-UP</span></p>
                        <p><strong>Street Lights:</strong> <span className="font-mono">0124-LIGHT-ON</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Grievance Categories */}
                  <div>
                    <h4 className="font-semibold mb-3">Related Grievance Categories</h4>
                    <div className="space-y-3">
                      {grievanceCategories
                        .filter(cat => cat.category_name.toLowerCase().includes(role.title.toLowerCase()) || 
                                     role.title.toLowerCase().includes(cat.category_name.toLowerCase().split(' ')[0]))
                        .slice(0, 3)
                        .map(category => (
                        <div key={category.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{category.category_name}</h5>
                            <Badge variant="outline">
                              {category.rts_timeline} days
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Level 1:</strong> {category.escalation_level_1}</p>
                            <p><strong>Level 2:</strong> {category.escalation_level_2}</p>
                            <p><strong>Level 3:</strong> {category.escalation_level_3}</p>
                            <p><strong>Helpline:</strong> {category.helpline_number}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Online Grievance */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Online Grievance Portal</h4>
                    <div className="space-y-2 text-sm">
                      <p>• Visit: <a href="https://grievance.mcgurugram.gov.in" className="text-blue-600 hover:underline">grievance.mcgurugram.gov.in</a></p>
                      <p>• Haryana CM Window: <a href="https://cmwindow.haryana.gov.in" className="text-blue-600 hover:underline">cmwindow.haryana.gov.in</a></p>
                      <p>• Central Public Grievance: <a href="https://pgportal.gov.in" className="text-blue-600 hover:underline">pgportal.gov.in</a></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Right to Service Act
                  </CardTitle>
                  <CardDescription>
                    Guaranteed service delivery timelines and citizen rights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* RTS Act Overview */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Your Rights Under RTS Act
                    </h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Right to receive services within specified timelines</li>
                      <li>• Right to appeal if service is delayed or denied</li>
                      <li>• Right to compensation for delays (where applicable)</li>
                      <li>• Right to transparent and accountable service delivery</li>
                    </ul>
                  </div>

                  {/* Related RTS Services */}
                  <div>
                    <h4 className="font-semibold mb-3">Services Under RTS Act</h4>
                    <div className="space-y-4">
                      {rtsServices
                        .filter(service => service.designated_officer.toLowerCase().includes(role.title.toLowerCase()) ||
                                         role.title.toLowerCase().includes(service.designated_officer.toLowerCase().split(' ')[0]))
                        .slice(0, 4)
                        .map(service => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">{service.service_name}</h5>
                            <div className="flex gap-2">
                              <Badge variant="info">
                                <Calendar className="w-3 h-3 mr-1" />
                                {service.timeline_days} days
                              </Badge>
                              <Badge variant="outline">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                ₹{service.fee_amount}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><strong>Designated Officer:</strong> {service.designated_officer}</p>
                              <p><strong>Timeline:</strong> {service.timeline_days} days</p>
                              <p><strong>Fee:</strong> ₹{service.fee_amount}</p>
                              <p><strong>Penalty for Delay:</strong> ₹{service.penalty_amount}</p>
                            </div>
                            <div>
                              <p><strong>Appellate Authority:</strong> {service.appellate_authority}</p>
                              <p><strong>Required Documents:</strong></p>
                              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                                {service.documents_required.split(',').map((doc, index) => (
                                  <li key={index}>• {doc.trim()}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Appeal Process */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">How to Appeal</h4>
                    <div className="space-y-2 text-sm">
                      <p>1. <strong>First Level:</strong> Appeal to the designated officer's supervisor</p>
                      <p>2. <strong>Second Level:</strong> Appeal to the appellate authority mentioned above</p>
                      <p>3. <strong>Third Level:</strong> Approach the State Information Commission</p>
                      <p>4. <strong>Legal Remedy:</strong> File writ petition in High Court if needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-gray-500">
            Information updated as per MCG records • Right to Service Act applicable
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDetailModal;
