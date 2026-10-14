import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import {
  getGalleryCategories,
  addGalleryCategory,
  renameGalleryCategory,
  deleteGalleryCategory,
} from '@/lib/gallery';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await getGalleryCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categories = await addGalleryCategory(name.trim());

    try {
      revalidatePath('/gallery');
      revalidatePath('/admin/gallery');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to add category' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { oldName, newName } = body;

    if (!oldName || !newName || typeof newName !== 'string' || !newName.trim()) {
      return NextResponse.json(
        { error: 'Both old and new category names are required' },
        { status: 400 }
      );
    }

    const categories = await renameGalleryCategory(oldName.trim(), newName.trim());

    try {
      revalidatePath('/gallery');
      revalidatePath('/admin/gallery');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error renaming category:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to rename category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const categories = await deleteGalleryCategory(name.trim());

    try {
      revalidatePath('/gallery');
      revalidatePath('/admin/gallery');
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
