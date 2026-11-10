import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || undefined;
    const employeeId = searchParams.get('employeeId') || undefined;

    const reviews = db.getReviews(projectId, employeeId);
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, rating, tags, comment, project } = body;

    if (!projectId || !rating) {
      return NextResponse.json(
        { error: 'projectId and rating are required.' },
        { status: 400 }
      );
    }

    const review = db.addReview({
      projectId,
      rating: parseInt(rating, 10),
      tags: tags || ['Good Installation'],
      comment: comment || 'Solar system installed satisfactorily.',
      project
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
