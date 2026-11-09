import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const projects = db.getProjects();
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      city,
      state,
      sanctionedLoad,
      discomName,
      systemCapacityKW,
      panelType,
      inverterType,
      structureType,
      contractValue,
      notes,
    } = body;

    if (!customerName || !customerPhone || !systemCapacityKW || !address) {
      return NextResponse.json(
        { error: 'Customer Name, Phone, Address, and System Capacity are required.' },
        { status: 400 }
      );
    }

    const project = db.createProject({
      customerName,
      customerPhone,
      customerEmail,
      address,
      city: city || 'New Delhi',
      state,
      sanctionedLoad,
      discomName,
      systemCapacityKW: parseFloat(systemCapacityKW),
      panelType,
      inverterType,
      structureType,
      contractValue: contractValue ? parseFloat(contractValue) : undefined,
      notes,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
