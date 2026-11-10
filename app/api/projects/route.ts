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

    const cleanCustPhone = project.customer?.phone?.replace(/\D/g, '') || '';
    const custNorm = cleanCustPhone.length >= 10 ? cleanCustPhone.slice(-10) : cleanCustPhone;
    const trackingUrl = `https://solarscienceportal-v1.vercel.app/track?query=${encodeURIComponent(custNorm)}`;

    const custMessage = encodeURIComponent(
      `☀️ *SolarScience Portal - Rooftop Solar Registration Confirmation*\n\n` +
      `Namaste *${project.customer?.name}* ji! 🙏\n\n` +
      `Aapka *${project.systemCapacityKW} kW* Rooftop Solar Project safaltapoorvak SolarScience Portal par register ho gaya hai.\n\n` +
      `📋 *Tracking ID / Project Code*: *${project.projectCode}*\n` +
      `📍 *Site Address*: ${project.customer?.address}, ${project.customer?.city}\n` +
      `⚡ *Current Status*: Stage 1 - Site Survey & Rooftop Feasibility\n\n` +
      `Aap apne rooftop solar project ka har ek step (Site Survey, 3D Design, DISCOM Net-Metering, Erection, Testing & Grid Sync) apne mobile par LIVE track kar sakte hain:\n\n` +
      `🔗 *Live Tracking Link*:\n${trackingUrl}\n\n` +
      `Kisi bhi sahayata ke liye contact karein:\n` +
      `📞 Toll-Free: 1800-889-SOLAR\n` +
      `_SolarScience Portal EPC Operations_`
    );

    const customerWhatsappUrl = `https://wa.me/91${custNorm}?text=${custMessage}`;

    return NextResponse.json({
      ...project,
      customerWhatsappUrl,
      trackingUrl
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
