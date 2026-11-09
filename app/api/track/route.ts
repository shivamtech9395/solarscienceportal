import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Search query (Mobile number or Project Code) is required.' }, { status: 400 });
    }

    // Try finding by project code
    let project = db.getProjectById(query);

    // If not found, try finding by customer phone
    if (!project) {
      project = db.getProjectByCustomerPhone(query);
    }

    if (!project) {
      return NextResponse.json({ error: 'No solar installation project found matching this Mobile Number or Project Code.' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
