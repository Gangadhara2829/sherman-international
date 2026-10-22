import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { getPartners, createPartner, savePartners, PartnerItem } from '@/lib/partners';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partners = await getPartners({ includeInactive: true });
    return NextResponse.json(partners);
  } catch (error: any) {
    console.error('Error fetching admin partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Support batch reorder update if payload is an array
    if (Array.isArray(body)) {
      await savePartners(body as PartnerItem[]);
      try {
        revalidatePath('/our-partners');
        revalidatePath('/admin/partners');
        revalidatePath('/');
      } catch (e) {}
      return NextResponse.json({ success: true, count: body.length });
    }

    const { name, logo, websiteUrl, description, displayOrder, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
    }
    if (!logo || !logo.trim()) {
      return NextResponse.json({ error: 'Partner logo is required' }, { status: 400 });
    }

    const partner = await createPartner({
      name: name.trim(),
      logo: logo.trim(),
      websiteUrl: websiteUrl ? websiteUrl.trim() : null,
      description: description ? description.trim() : null,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    try {
      revalidatePath('/our-partners');
      revalidatePath('/admin/partners');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(partner, { status: 201 });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create partner' },
      { status: 500 }
    );
  }
}
