import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug, shortDescription, fullDescription, capabilities, image, icon, displayOrder, isPublished } = await request.json();
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slugify(slug);
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (fullDescription !== undefined) updateData.fullDescription = fullDescription;
    if (capabilities !== undefined) {
      updateData.capabilities = typeof capabilities === 'string' ? capabilities : JSON.stringify(capabilities);
    }
    if (image !== undefined) updateData.image = image;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
