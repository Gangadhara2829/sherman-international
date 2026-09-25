import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // Array of { id: string, displayOrder: number }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    // Update in transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.proudlyServedClient.update({
          where: { id: item.id },
          data: { displayOrder: Number(item.displayOrder) },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Display orders updated' });
  } catch (error: any) {
    console.error('Error reordering clients:', error);
    return NextResponse.json({ error: 'Failed to reorder clients' }, { status: 500 });
  }
}
