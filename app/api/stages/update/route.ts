import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId,
      stageNumber,
      employeeId,
      remarks,
      photoUrl,
      markCompleted,
      checklist,
      metrics,
    } = body;

    if (!projectId || !stageNumber || !employeeId || !remarks) {
      return NextResponse.json(
        { error: 'projectId, stageNumber, employeeId, and remarks are required.' },
        { status: 400 }
      );
    }

    const updatedProject = db.updateStageProgress({
      projectId,
      stageNumber: parseInt(stageNumber, 10),
      employeeId,
      remarks,
      photoUrl,
      markCompleted: Boolean(markCompleted),
      checklist,
      metrics,
    });

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
