import fs from 'fs';
import path from 'path';
import os from 'os';
import { Employee, Customer, Project, Notification, AuditLog, ProjectStage, Review } from '@/types';
import { SOLAR_INSTALLATION_STAGES } from './constants';

const IS_SERVERLESS = Boolean(process.env.VERCEL) || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const SEED_FILE = path.join(LOCAL_DATA_DIR, 'db.json');

// On Vercel / serverless runtime, process.cwd() is read-only. We use os.tmpdir() (/tmp) which is writable.
const DB_FILE = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'solarscience_db.json')
  : path.join(LOCAL_DATA_DIR, 'db.json');

// Global in-memory cache to guarantee persistence and instantaneous response
let memoryDb: DatabaseSchema | null = null;

interface DatabaseSchema {
  employees: Employee[];
  customers: Customer[];
  projects: Project[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  reviews: Review[];
}

function getInitialData(): DatabaseSchema {
  const emp1: Employee = {
    id: 'emp-1',
    employeeCode: 'EMP-101',
    name: 'Amit Sharma',
    phone: '9871122334',
    role: 'Site Surveyor',
    department: 'Site Engineering',
    pin: '1234',
    status: 'Active',
    rating: 4.9,
    totalCompletedJobs: 14,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  };

  const emp2: Employee = {
    id: 'emp-2',
    employeeCode: 'EMP-102',
    name: 'Neha Verma',
    phone: '9872233445',
    role: 'Solar Design Engineer',
    department: 'Engineering & CAD',
    pin: '1234',
    status: 'Active',
    rating: 4.8,
    totalCompletedJobs: 21,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString()
  };

  const emp3: Employee = {
    id: 'emp-3',
    employeeCode: 'EMP-103',
    name: 'Rajesh Meena',
    phone: '9873344556',
    role: 'Liaisoning Officer',
    department: 'DISCOM & Regulatory',
    pin: '1234',
    status: 'Active',
    rating: 4.7,
    totalCompletedJobs: 19,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  };

  const emp4: Employee = {
    id: 'emp-4',
    employeeCode: 'EMP-104',
    name: 'Suresh Kumar',
    phone: '9874455667',
    role: 'Structure Technician',
    department: 'Mechanical Erection',
    pin: '1234',
    status: 'Busy',
    rating: 4.9,
    totalCompletedJobs: 16,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  };

  const emp5: Employee = {
    id: 'emp-5',
    employeeCode: 'EMP-105',
    name: 'Vikram Singh',
    phone: '9875566778',
    role: 'Solar Electrician',
    department: 'Electrical Field Ops',
    pin: '1234',
    status: 'Active',
    rating: 5.0,
    totalCompletedJobs: 28,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  };

  const cust1: Customer = {
    id: 'cust-1',
    name: 'Ramesh Chandra Sharma',
    phone: '9810012345',
    email: 'ramesh.sharma@gmail.com',
    address: 'B-42, Sector 14, Rohini',
    city: 'New Delhi',
    state: 'Delhi',
    sanctionedLoad: '5 kW (Single Phase)',
    discomName: 'TPDDL (Tata Power DDL)',
    consumerNumber: 'CA-90234811',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
  };

  const cust2: Customer = {
    id: 'cust-2',
    name: 'Sunita Singhania',
    phone: '9820054321',
    email: 'sunita.singhania@yahoo.com',
    address: 'Plot 78, Phase 2, DLF Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    sanctionedLoad: '10 kW (3-Phase)',
    discomName: 'DHBVN',
    consumerNumber: 'DH-55442201',
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString()
  };

  const generateStagesForProject = (projectId: string, currentStage: number): ProjectStage[] => {
    return SOLAR_INSTALLATION_STAGES.map((template) => {
      let status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' = 'Pending';
      let assignedEmp: Employee | null = null;
      let completedAt: string | null = null;
      let assignedAt: string | null = null;

      if (template.stageNumber < currentStage) {
        status = 'Completed';
        completedAt = new Date(Date.now() - (currentStage - template.stageNumber) * 2 * 86400000).toISOString();
        assignedAt = new Date(Date.now() - (currentStage - template.stageNumber + 1) * 2 * 86400000).toISOString();
        if (template.stageNumber === 1) assignedEmp = emp1;
        if (template.stageNumber === 2) assignedEmp = emp2;
        if (template.stageNumber === 3) assignedEmp = emp3;
        if (template.stageNumber === 5) assignedEmp = emp4;
      } else if (template.stageNumber === currentStage) {
        status = 'In Progress';
        assignedAt = new Date(Date.now() - 1 * 86400000).toISOString();
        if (template.stageNumber === 6) assignedEmp = emp5;
        if (template.stageNumber === 1) assignedEmp = emp1;
        if (template.stageNumber === 5) assignedEmp = emp4;
      }

      return {
        id: `stg-${projectId}-${template.stageNumber}`,
        projectId,
        stageNumber: template.stageNumber,
        title: template.title,
        description: template.description,
        requiredRole: template.requiredRole,
        status,
        assignedEmployeeId: assignedEmp ? assignedEmp.id : null,
        assignedEmployee: assignedEmp,
        assignedAt,
        completedAt,
        checklist: template.defaultChecklist.map((task) => ({
          task,
          completed: template.stageNumber < currentStage
        })),
        updates: template.stageNumber < currentStage ? [
          {
            id: `upd-${projectId}-${template.stageNumber}`,
            stageId: `stg-${projectId}-${template.stageNumber}`,
            employeeId: assignedEmp ? assignedEmp.id : emp1.id,
            employeeName: assignedEmp ? assignedEmp.name : emp1.name,
            employeeRole: assignedEmp ? assignedEmp.role : emp1.role,
            remarks: `Completed ${template.title} verification with all safety parameters satisfied.`,
            photoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
            createdAt: completedAt || new Date().toISOString()
          }
        ] : []
      };
    });
  };

  const proj1: Project = {
    id: 'proj-1',
    projectCode: 'SP-2026-101',
    customerId: cust1.id,
    customer: cust1,
    systemCapacityKW: 5.0,
    panelType: '550W Mono PERC Bifacial (9 Panels)',
    inverterType: 'Growatt 5kW 1-Phase On-Grid Inverter',
    structureType: 'Elevated HDG Structure (7ft clearance)',
    overallStatus: 'In Progress',
    currentStageNumber: 6, // At Stage 6: Electrical Cabling & Inverter Setup
    contractValue: 245000,
    notes: 'South-facing rooftop, 450 sq ft shadow-free area available.',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    stages: generateStagesForProject('proj-1', 6)
  };

  const proj2: Project = {
    id: 'proj-2',
    projectCode: 'SP-2026-102',
    customerId: cust2.id,
    customer: cust2,
    systemCapacityKW: 10.0,
    panelType: '575W TopCon Bifacial (18 Panels)',
    inverterType: 'Solis 10kW 3-Phase Dual MPPT Inverter',
    structureType: 'High-Rise Ballasted GI Structure',
    overallStatus: 'In Progress',
    currentStageNumber: 2, // At Stage 2: System Design & CAD
    contractValue: 480000,
    notes: 'Commercial rooftop with high seasonal wind gust rating.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    stages: generateStagesForProject('proj-2', 2)
  };

  const notif1: Notification = {
    id: 'notif-1',
    employeeId: emp5.id,
    title: 'New Milestone Assigned: Stage 6 - Electrical Cabling',
    message: 'Admin has assigned you to project SP-2026-101 (Ramesh Chandra Sharma - 5.0 kW) for DC wiring & inverter mounting.',
    projectId: proj1.id,
    projectCode: proj1.projectCode,
    stageId: `stg-${proj1.id}-6`,
    stageNumber: 6,
    stageTitle: 'Electrical Cabling & Inverter Setup',
    customerName: cust1.name,
    customerPhone: cust1.phone,
    siteAddress: cust1.address,
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  };

  const notif2: Notification = {
    id: 'notif-2',
    employeeId: emp2.id,
    title: 'New Milestone Assigned: Stage 2 - System Design',
    message: 'Admin has assigned you to project SP-2026-102 (Sunita Singhania - 10.0 kW) for 3D layout and SLD generation.',
    projectId: proj2.id,
    projectCode: proj2.projectCode,
    stageId: `stg-${proj2.id}-2`,
    stageNumber: 2,
    stageTitle: 'System Design & 3D Engineering',
    customerName: cust2.name,
    customerPhone: cust2.phone,
    siteAddress: cust2.address,
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  };

  const audit1: AuditLog = {
    id: 'audit-1',
    projectId: proj1.id,
    projectCode: proj1.projectCode,
    customerName: cust1.name,
    employeeId: emp1.id,
    employeeName: emp1.name,
    action: 'STAGE_COMPLETED',
    performedBy: emp1.name,
    details: 'Completed Site Survey & Shadow Analysis for 5.0 kW system. Roof area 450 sqft approved.',
    photoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    timestamp: new Date(Date.now() - 10 * 86400000).toISOString()
  };

  const audit2: AuditLog = {
    id: 'audit-2',
    projectId: proj1.id,
    projectCode: proj1.projectCode,
    customerName: cust1.name,
    employeeId: emp4.id,
    employeeName: emp4.name,
    action: 'STAGE_COMPLETED',
    performedBy: emp4.name,
    details: 'Completed Mechanical Structure Assembly. Hot-dip galvanized structure mounted at 28-degree tilt.',
    photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
  };

  const audit3: AuditLog = {
    id: 'audit-3',
    projectId: proj1.id,
    projectCode: proj1.projectCode,
    customerName: cust1.name,
    employeeId: emp5.id,
    employeeName: emp5.name,
    action: 'STAGE_ASSIGNED',
    performedBy: 'Operations Admin',
    details: 'Assigned Stage 6 (Electrical Cabling & Inverter Setup) to Vikram Singh. Automated notification dispatched.',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString()
  };

  const review1: Review = {
    id: 'rev-1',
    projectId: proj1.id,
    projectCode: proj1.projectCode,
    customerName: cust1.name,
    customerPhone: cust1.phone,
    employeeId: emp4.id,
    employeeName: emp4.name,
    rating: 5,
    tags: ['Professional Erection', 'On-Time', 'Clean Work'],
    comment: 'Structure installation by Suresh Kumar was very neat and fast! Sturdy galvanized build.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  };

  return {
    employees: [emp1, emp2, emp3, emp4, emp5],
    customers: [cust1, cust2],
    projects: [proj1, proj2],
    notifications: [notif1, notif2],
    auditLogs: [audit1, audit2, audit3],
    reviews: [review1]
  };
}

function ensureDataFile(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  // 1. Try reading existing active DB file (e.g. /tmp/solarscience_db.json or data/db.json)
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.reviews) parsed.reviews = [];
      memoryDb = parsed;
      return memoryDb!;
    } catch (e) {
      console.warn('Failed to parse DB_FILE, attempting seed fallback', e);
    }
  }

  // 2. Try reading bundled seed file if DB file does not exist yet
  if (fs.existsSync(SEED_FILE)) {
    try {
      const raw = fs.readFileSync(SEED_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.reviews) parsed.reviews = [];
      memoryDb = parsed;
      saveData(parsed);
      return memoryDb!;
    } catch (e) {
      console.warn('Failed to parse SEED_FILE', e);
    }
  }

  // 3. Fallback to programmatic initial data
  const initial = getInitialData();
  memoryDb = initial;
  saveData(initial);
  return memoryDb;
}

function saveData(data: DatabaseSchema) {
  memoryDb = data;
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write notice (using memory cache fallback):', err);
  }
}

export const db = {
  getEmployees(): Employee[] {
    const data = ensureDataFile();
    return data.employees;
  },

  getEmployeeById(id: string): Employee | undefined {
    const data = ensureDataFile();
    return data.employees.find((e) => e.id === id);
  },

  getEmployeeByPhone(phone: string): Employee | undefined {
    const data = ensureDataFile();
    const cleanPhone = phone.replace(/\D/g, '');
    return data.employees.find((e) => e.phone.replace(/\D/g, '') === cleanPhone);
  },

  addEmployee(emp: Omit<Employee, 'id' | 'createdAt'>): Employee {
    const data = ensureDataFile();
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`,
      rating: 5.0,
      totalCompletedJobs: 0,
      createdAt: new Date().toISOString()
    };
    data.employees.push(newEmp);

    data.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      action: 'EMPLOYEE_ADDED',
      performedBy: 'Admin',
      details: `Added new employee ${newEmp.name} as ${newEmp.role} (Code: ${newEmp.employeeCode})`,
      timestamp: new Date().toISOString()
    });

    saveData(data);
    return newEmp;
  },

  getCustomers(): Customer[] {
    const data = ensureDataFile();
    return data.customers;
  },

  getProjects(): Project[] {
    const data = ensureDataFile();
    return data.projects;
  },

  getProjectById(id: string): Project | undefined {
    const data = ensureDataFile();
    return data.projects.find((p) => p.id === id || p.projectCode.toLowerCase() === id.toLowerCase());
  },

  getProjectByCustomerPhone(phone: string): Project | undefined {
    const data = ensureDataFile();
    const cleanPhone = phone.replace(/\D/g, '');
    const customer = data.customers.find((c) => c.phone.replace(/\D/g, '') === cleanPhone);
    if (!customer) return undefined;
    return data.projects.find((p) => p.customerId === customer.id);
  },

  createProject(params: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    city: string;
    state?: string;
    sanctionedLoad?: string;
    discomName?: string;
    systemCapacityKW: number;
    panelType?: string;
    inverterType?: string;
    structureType?: string;
    contractValue?: number;
    notes?: string;
  }): Project {
    const data = ensureDataFile();
    const custId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id: custId,
      name: params.customerName,
      phone: params.customerPhone,
      email: params.customerEmail,
      address: params.address,
      city: params.city,
      state: params.state || 'Delhi NCR',
      sanctionedLoad: params.sanctionedLoad || `${params.systemCapacityKW} kW`,
      discomName: params.discomName || 'State DISCOM',
      createdAt: new Date().toISOString()
    };
    data.customers.push(newCustomer);

    const projId = `proj-${Date.now()}`;
    const projectCode = `SP-${new Date().getFullYear()}-${100 + data.projects.length + 1}`;

    const stages: ProjectStage[] = SOLAR_INSTALLATION_STAGES.map((tpl) => ({
      id: `stg-${projId}-${tpl.stageNumber}`,
      projectId: projId,
      stageNumber: tpl.stageNumber,
      title: tpl.title,
      description: tpl.description,
      requiredRole: tpl.requiredRole,
      status: 'Pending',
      assignedEmployeeId: null,
      assignedEmployee: null,
      assignedAt: null,
      completedAt: null,
      checklist: tpl.defaultChecklist.map((task) => ({ task, completed: false })),
      updates: []
    }));

    const newProject: Project = {
      id: projId,
      projectCode,
      customerId: custId,
      customer: newCustomer,
      systemCapacityKW: params.systemCapacityKW,
      panelType: params.panelType || '550W Mono PERC Bifacial',
      inverterType: params.inverterType || `${params.systemCapacityKW}kW On-Grid Inverter`,
      structureType: params.structureType || 'Elevated Galvanized Iron',
      overallStatus: 'In Progress',
      currentStageNumber: 1,
      contractValue: params.contractValue || params.systemCapacityKW * 50000,
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stages
    };

    data.projects.unshift(newProject);

    data.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      projectId: projId,
      projectCode,
      customerName: newCustomer.name,
      action: 'PROJECT_CREATED',
      performedBy: 'Admin',
      details: `Created new ${newProject.systemCapacityKW} kW solar project for ${newCustomer.name} at ${newCustomer.city}.`,
      timestamp: new Date().toISOString()
    });

    saveData(data);
    return newProject;
  },

  assignStage(params: {
    projectId: string;
    stageNumber: number;
    employeeId: string;
  }): { project: Project; notification: Notification } {
    const data = ensureDataFile();
    const project = data.projects.find((p) => p.id === params.projectId);
    if (!project) throw new Error('Project not found');

    const employee = data.employees.find((e) => e.id === params.employeeId);
    if (!employee) throw new Error('Employee not found');

    const stage = project.stages.find((s) => s.stageNumber === params.stageNumber);
    if (!stage) throw new Error('Stage not found');

    stage.assignedEmployeeId = employee.id;
    stage.assignedEmployee = employee;
    stage.assignedAt = new Date().toISOString();
    if (stage.status === 'Pending') {
      stage.status = 'Assigned';
    }

    project.updatedAt = new Date().toISOString();

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      employeeId: employee.id,
      title: `New Assignment: Stage ${stage.stageNumber} - ${stage.title}`,
      message: `Admin assigned you to project ${project.projectCode} (${project.customer?.name} - ${project.systemCapacityKW} kW) located at ${project.customer?.address}.`,
      projectId: project.id,
      projectCode: project.projectCode,
      stageId: stage.id,
      stageNumber: stage.stageNumber,
      stageTitle: stage.title,
      customerName: project.customer?.name,
      customerPhone: project.customer?.phone,
      siteAddress: project.customer?.address,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    data.notifications.unshift(notif);

    data.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      customerName: project.customer?.name,
      employeeId: employee.id,
      employeeName: employee.name,
      action: 'STAGE_ASSIGNED',
      performedBy: 'Admin',
      details: `Assigned Stage ${stage.stageNumber} (${stage.title}) to ${employee.name} (${employee.role}). Message notification triggered.`,
      timestamp: new Date().toISOString()
    });

    saveData(data);
    return { project, notification: notif };
  },

  updateStageProgress(params: {
    projectId: string;
    stageNumber: number;
    employeeId: string;
    remarks: string;
    photoUrl?: string;
    markCompleted: boolean;
    checklist?: { task: string; completed: boolean }[];
    metrics?: Record<string, any>;
  }): Project {
    const data = ensureDataFile();
    const project = data.projects.find((p) => p.id === params.projectId);
    if (!project) throw new Error('Project not found');

    const employee = data.employees.find((e) => e.id === params.employeeId);
    if (!employee) throw new Error('Employee not found');

    const stage = project.stages.find((s) => s.stageNumber === params.stageNumber);
    if (!stage) throw new Error('Stage not found');

    if (params.checklist) {
      stage.checklist = params.checklist;
    }

    const updateRecord = {
      id: `upd-${Date.now()}`,
      stageId: stage.id,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.role,
      remarks: params.remarks,
      photoUrl: params.photoUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      metrics: params.metrics,
      createdAt: new Date().toISOString()
    };
    stage.updates.unshift(updateRecord);

    if (params.markCompleted) {
      stage.status = 'Completed';
      stage.completedAt = new Date().toISOString();
      employee.totalCompletedJobs = (employee.totalCompletedJobs || 0) + 1;

      if (project.currentStageNumber === stage.stageNumber) {
        if (project.currentStageNumber < 8) {
          project.currentStageNumber += 1;
          const nextStage = project.stages.find((s) => s.stageNumber === project.currentStageNumber);
          if (nextStage && nextStage.status === 'Pending') {
            nextStage.status = 'In Progress';
          }
        } else {
          project.overallStatus = 'Completed';
        }
      }

      data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        projectId: project.id,
        projectCode: project.projectCode,
        customerName: project.customer?.name,
        employeeId: employee.id,
        employeeName: employee.name,
        action: 'STAGE_COMPLETED',
        performedBy: employee.name,
        details: `Stage ${stage.stageNumber} (${stage.title}) marked COMPLETED by ${employee.name}. Remarks: "${params.remarks}"`,
        photoUrl: updateRecord.photoUrl,
        timestamp: new Date().toISOString()
      });
    } else {
      stage.status = 'In Progress';

      data.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        projectId: project.id,
        projectCode: project.projectCode,
        customerName: project.customer?.name,
        employeeId: employee.id,
        employeeName: employee.name,
        action: 'STAGE_UPDATED',
        performedBy: employee.name,
        details: `Updated Stage ${stage.stageNumber} progress: "${params.remarks}"`,
        photoUrl: updateRecord.photoUrl,
        timestamp: new Date().toISOString()
      });
    }

    project.updatedAt = new Date().toISOString();
    saveData(data);
    return project;
  },

  getNotifications(employeeId?: string): Notification[] {
    const data = ensureDataFile();
    if (!employeeId) return data.notifications;
    return data.notifications.filter((n) => n.employeeId === employeeId);
  },

  markNotificationRead(notificationId: string): void {
    const data = ensureDataFile();
    const notif = data.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      saveData(data);
    }
  },

  getAuditLogs(filters?: { projectId?: string; employeeId?: string }): AuditLog[] {
    const data = ensureDataFile();
    let logs = data.auditLogs;
    if (filters?.projectId) {
      logs = logs.filter((l) => l.projectId === filters.projectId);
    }
    if (filters?.employeeId) {
      logs = logs.filter((l) => l.employeeId === filters.employeeId);
    }
    return logs;
  },

  addReview(params: {
    projectId: string;
    rating: number;
    tags: string[];
    comment: string;
  }): Review {
    const data = ensureDataFile();
    const project = data.projects.find((p) => p.id === params.projectId);
    if (!project) throw new Error('Project not found');

    const activeStage = project.stages.find((s) => s.stageNumber === project.currentStageNumber);
    const assignedEmp = activeStage?.assignedEmployee || data.employees[0];

    const review: Review = {
      id: `rev-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      customerName: project.customer?.name || 'Customer',
      customerPhone: project.customer?.phone || '',
      employeeId: assignedEmp ? assignedEmp.id : undefined,
      employeeName: assignedEmp ? assignedEmp.name : undefined,
      rating: params.rating,
      tags: params.tags,
      comment: params.comment,
      createdAt: new Date().toISOString()
    };

    if (!data.reviews) data.reviews = [];
    data.reviews.unshift(review);

    // Update technician rating average
    if (assignedEmp) {
      const empReviews = data.reviews.filter((r) => r.employeeId === assignedEmp.id);
      const avg = empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length;
      assignedEmp.rating = parseFloat(avg.toFixed(1));
    }

    data.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      customerName: project.customer?.name,
      employeeId: assignedEmp?.id,
      employeeName: assignedEmp?.name,
      action: 'REVIEW_SUBMITTED',
      performedBy: project.customer?.name || 'Customer',
      details: `Customer submitted ${params.rating}-Star service review for ${assignedEmp?.name || 'team'}. Comment: "${params.comment}"`,
      timestamp: new Date().toISOString()
    });

    saveData(data);
    return review;
  },

  getReviews(projectId?: string, employeeId?: string): Review[] {
    const data = ensureDataFile();
    let revs = data.reviews || [];
    if (projectId) revs = revs.filter((r) => r.projectId === projectId);
    if (employeeId) revs = revs.filter((r) => r.employeeId === employeeId);
    return revs;
  }
};
