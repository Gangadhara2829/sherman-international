import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug, shortDescription, fullDescription, capabilities, image, icon, displayOrder, isPublished } = await request.json();
    if (!name || !shortDescription) {
      return NextResponse.json({ error: 'Name and short description are required' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug: slug ? slugify(slug) : slugify(name),
        shortDescription,
        fullDescription: fullDescription || null,
        capabilities: typeof capabilities === 'string' ? capabilities : JSON.stringify(capabilities || []),
        image: image || null,
        icon: icon || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.code === 'P2002' ? 'Service slug already exists' : 'Failed to create service' },
      { status: 500 }
    );
  }
}
