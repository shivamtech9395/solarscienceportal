const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SOLAR_STAGES = [
  { stageNumber: 1, title: 'Site Survey & Rooftop Feasibility', role: 'Site Surveyor', desc: 'Rooftop measurement and shadow analysis' },
  { stageNumber: 2, title: 'System Design & 3D Engineering', role: 'Solar Design Engineer', desc: '3D CAD shadow layout and SLD' },
  { stageNumber: 3, title: 'DISCOM / Net-Metering Application', role: 'Liaisoning Officer', desc: 'Grid feasibility and subsidy authorization' },
  { stageNumber: 4, title: 'Material Procurement & Delivery', role: 'Warehouse Manager', desc: 'Tier-1 panels and inverter dispatch' },
  { stageNumber: 5, title: 'Mechanical Structure Assembly', role: 'Structure Technician', desc: 'Elevated HDG structure mounting and clamping' },
  { stageNumber: 6, title: 'Electrical Cabling & Inverter Setup', role: 'Solar Electrician', desc: 'DC conduit wiring and inverter mounting' },
  { stageNumber: 7, title: 'DISCOM Inspection & Net-Meter', role: 'Liaisoning Officer', desc: 'Discom inspector verification and bidirectional meter' },
  { stageNumber: 8, title: 'Commissioning, App Setup & Handover', role: 'Commissioning Engineer', desc: 'Grid sync, generation check, and handover' },
];

async function main() {
  console.log('🌱 Seeding PostgreSQL Database with SolarSciencePortal records...');

  // 1. Clean existing records (optional)
  try {
    await prisma.review.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.stageUpdate.deleteMany();
    await prisma.projectStage.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.project.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.employee.deleteMany();
  } catch (e) {
    // ignore if tables are empty
  }

  // 2. Create Employees
  const emp1 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-101',
      name: 'Amit Sharma',
      phone: '9871122334',
      role: 'Site Surveyor',
      department: 'Site Engineering',
      pin: '1234',
      status: 'Active',
      rating: 4.9,
      totalCompletedJobs: 14,
    }
  });

  const emp2 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-102',
      name: 'Neha Verma',
      phone: '9872233445',
      role: 'Solar Design Engineer',
      department: 'Engineering & CAD',
      pin: '1234',
      status: 'Active',
      rating: 4.8,
      totalCompletedJobs: 21,
    }
  });

  const emp3 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-103',
      name: 'Rajesh Meena',
      phone: '9873344556',
      role: 'Liaisoning Officer',
      department: 'DISCOM & Regulatory',
      pin: '1234',
      status: 'Active',
      rating: 4.7,
      totalCompletedJobs: 19,
    }
  });

  const emp4 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-104',
      name: 'Suresh Kumar',
      phone: '9874455667',
      role: 'Structure Technician',
      department: 'Mechanical Erection',
      pin: '1234',
      status: 'Busy',
      rating: 4.9,
      totalCompletedJobs: 16,
    }
  });

  const emp5 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP-105',
      name: 'Vikram Singh',
      phone: '9875566778',
      role: 'Solar Electrician',
      department: 'Electrical Field Ops',
      pin: '1234',
      status: 'Active',
      rating: 5.0,
      totalCompletedJobs: 28,
    }
  });

  console.log('✅ Created 5 Employees');

  // 3. Create Customers
  const cust1 = await prisma.customer.create({
    data: {
      name: 'Ramesh Chandra Sharma',
      phone: '9810012345',
      email: 'ramesh.sharma@gmail.com',
      address: 'B-42, Sector 14, Rohini',
      city: 'New Delhi',
      state: 'Delhi',
      sanctionedLoad: '5 kW (Single Phase)',
      discomName: 'TPDDL (Tata Power DDL)',
    }
  });

  const cust2 = await prisma.customer.create({
    data: {
      name: 'Sunita Singhania',
      phone: '9820054321',
      email: 'sunita.singhania@yahoo.com',
      address: 'Plot 78, Phase 2, DLF Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      sanctionedLoad: '10 kW (3-Phase)',
      discomName: 'DHBVN',
    }
  });

  console.log('✅ Created 2 Customers');

  // 4. Create Solar Projects
  const proj1 = await prisma.project.create({
    data: {
      projectCode: 'SP-2026-101',
      customerId: cust1.id,
      systemCapacityKW: 5.0,
      panelType: '550W Mono PERC Bifacial',
      inverterType: '5kW On-Grid String Inverter',
      structureType: 'Elevated HDG Structure (7ft)',
      overallStatus: 'In Progress',
      currentStageNumber: 6,
      contractValue: 245000,
      notes: 'South-facing rooftop, 450 sq ft shadow-free area available.',
      stages: {
        create: SOLAR_STAGES.map((s) => ({
          stageNumber: s.stageNumber,
          title: s.title,
          description: s.desc,
          requiredRole: s.role,
          status: s.stageNumber < 6 ? 'Completed' : s.stageNumber === 6 ? 'In Progress' : 'Pending',
          assignedEmployeeId: s.stageNumber === 6 ? emp5.id : s.stageNumber === 5 ? emp4.id : emp1.id,
          checklistJson: JSON.stringify(['Site inspection completed', 'Verified safety SOPs']),
        }))
      }
    }
  });

  // 5. Create Notification
  await prisma.notification.create({
    data: {
      employeeId: emp5.id,
      title: 'New Milestone Assigned: Stage 6 - Electrical Cabling',
      message: 'Admin has assigned you to project SP-2026-101 (Ramesh Chandra Sharma - 5.0 kW) for DC wiring & inverter mounting.',
      projectId: proj1.id,
      stageId: `stg-${proj1.id}-6`,
      isRead: false,
    }
  });

  // 6. Create Review
  await prisma.review.create({
    data: {
      projectId: proj1.id,
      customerName: cust1.name,
      customerPhone: cust1.phone,
      employeeId: emp4.id,
      rating: 5,
      tagsJson: JSON.stringify(['Clean Wiring', 'Heavy Structure', 'On-Time Arrival']),
      comment: 'Excellent structure installation and very polite staff!',
    }
  });

  console.log('🎉 PostgreSQL Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
