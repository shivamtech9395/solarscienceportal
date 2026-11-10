import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, stageNumber, employeeId, project } = body;

    if (!projectId || !stageNumber || !employeeId) {
      return NextResponse.json(
        { error: 'projectId, stageNumber, and employeeId are required.' },
        { status: 400 }
      );
    }

    const result = db.assignStage({
      projectId,
      stageNumber: parseInt(stageNumber, 10),
      employeeId,
      project,
    });

    const emp = db.getEmployees().find((e) => e.id === employeeId);
    const cleanPhone = emp?.phone.replace(/\D/g, '') || '';
    const messageText = encodeURIComponent(
      `☀️ *SolarScience Task Assignment Alert*\n\n` +
      `Hello ${emp?.name || 'Engineer'},\n` +
      `You have been assigned to Solar Project *${result.project.projectCode}* (${result.project.systemCapacityKW} kW).\n\n` +
      `📋 *Milestone*: Stage ${stageNumber} - ${result.notification.stageTitle}\n` +
      `📍 *Site Address*: ${result.project.customer?.address || 'Site'}\n` +
      `👤 *Customer*: ${result.project.customer?.name} (${result.project.customer?.phone})\n\n` +
      `Please open your Employee Portal to submit site photos and mark progress.`
    );

    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${messageText}`;

    return NextResponse.json({
      success: true,
      project: result.project,
      notification: result.notification,
      whatsappUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
