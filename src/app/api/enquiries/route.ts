import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const whereClause = status ? { status } : {};
    const enquiries = await prisma.enquiry.findMany({
      where: whereClause,
      include: {
        product: {
          select: { name: true, slug: true, category: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

import { sendEnquiryNotificationEmail, SendEmailResult } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, productId, productName, categoryName, message, source } = body;

    // Validate essential fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Please enter your message or technical requirement.' }, { status: 400 });
    }

    // 1. Save enquiry to database (source of truth)
    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        company: company && typeof company === 'string' ? company.trim() : null,
        email: email.trim().toLowerCase(),
        phone: phone && typeof phone === 'string' ? phone.trim() : null,
        productId: productId || null,
        productName: productName && typeof productName === 'string' ? productName.trim() : 'General Enquiry',
        categoryName: categoryName && typeof categoryName === 'string' ? categoryName.trim() : null,
        message: message.trim(),
        status: 'NEW',
      },
    });

    console.log(`[ENQUIRY SAVED] DB ID: ${enquiry.id} from ${name} (${email}) for ${productName || 'General'}`);

    // 2. Dispatch email notification via Resend to configured Enquiry Email
    let emailResult: SendEmailResult = { sent: false };
    try {
      emailResult = await sendEnquiryNotificationEmail({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company,
        productName: enquiry.productName,
        categoryName: enquiry.categoryName,
        message: enquiry.message,
        enquiryId: enquiry.id,
        source: source || 'general',
      });
    } catch (mailErr: any) {
      console.error('[Email Dispatch Warning]', mailErr);
      emailResult.error = mailErr.message || 'Email delivery failed';
    }

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        emailNotification: {
          sent: emailResult.sent,
          recipient: emailResult.recipient,
        },
        message: 'Your enquiry has been received by Sherman International (P) Limited.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
