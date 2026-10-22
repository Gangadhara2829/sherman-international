import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { updatePartner, deletePartner } from '@/lib/partners';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updatePartner(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    try {
      revalidatePath('/our-partners');
      revalidatePath('/admin/partners');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deletePartner(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    try {
      revalidatePath('/our-partners');
      revalidatePath('/admin/partners');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete partner' },
      { status: 500 }
    );
  }
}
