export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  phone: string;
  role: string;
  department: string;
  pin: string;
  status: 'Active' | 'Busy' | 'On Leave';
  rating?: number;
  totalCompletedJobs?: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  sanctionedLoad?: string;
  discomName?: string;
  consumerNumber?: string;
  createdAt: string;
}

export interface StageUpdate {
  id: string;
  stageId: string;
  employeeId: string;
  employeeName?: string;
  employeeRole?: string;
  remarks: string;
  photoUrl?: string;
  metrics?: Record<string, any>;
  createdAt: string;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  stageNumber: number;
  title: string;
  description: string;
  requiredRole: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  assignedEmployeeId?: string | null;
  assignedEmployee?: Employee | null;
  assignedAt?: string | null;
  completedAt?: string | null;
  checklist: { task: string; completed: boolean }[];
  updates: StageUpdate[];
}

export interface Project {
  id: string;
  projectCode: string;
  customerId: string;
  customer?: Customer;
  systemCapacityKW: number;
  panelType: string;
  inverterType: string;
  structureType: string;
  overallStatus: 'In Progress' | 'Completed' | 'On Hold';
  currentStageNumber: number;
  contractValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stages: ProjectStage[];
  reviews?: Review[];
}

export interface Notification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  projectId?: string;
  projectCode?: string;
  stageId?: string;
  stageNumber?: number;
  stageTitle?: string;
  customerName?: string;
  customerPhone?: string;
  siteAddress?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  projectId?: string;
  projectCode?: string;
  customerName?: string;
  employeeId?: string;
  employeeName?: string;
  action: 'PROJECT_CREATED' | 'STAGE_ASSIGNED' | 'STAGE_UPDATED' | 'STAGE_COMPLETED' | 'EMPLOYEE_ADDED' | 'REVIEW_SUBMITTED';
  performedBy: string;
  details: string;
  photoUrl?: string;
  timestamp: string;
}

export interface Review {
  id: string;
  projectId: string;
  projectCode: string;
  customerName: string;
  customerPhone: string;
  employeeId?: string;
  employeeName?: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  createdAt: string;
}
