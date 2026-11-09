import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const employees = db.getEmployees();
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, role, department, employeeCode, pin } = body;

    if (!name || !phone || !role) {
      return NextResponse.json(
        { error: 'Name, Phone, and Role are required.' },
        { status: 400 }
      );
    }

    const employee = db.addEmployee({
      name,
      phone,
      role,
      department: department || 'Field Operations',
      employeeCode: employeeCode || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      pin: pin || '1234',
      status: 'Active',
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
