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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, productId, productName, categoryName, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        company: company || null,
        email,
        phone: phone || null,
        productId: productId || null,
        productName: productName || 'General Enquiry',
        categoryName: categoryName || null,
        message,
        status: 'NEW',
      },
    });

    // In a production server, here we dispatch an email to admin@sherman-india.com
    console.log(`[ENQUIRY RECEIVED] To Sherman: ${enquiry.id} from ${name} (${email}) for ${productName}`);

    return NextResponse.json(
      {
        success: true,
        enquiryId: enquiry.id,
        message: 'Your enquiry has been received by Sherman International (P) Limited.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
