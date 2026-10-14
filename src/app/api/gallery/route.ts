import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItems } from '@/lib/gallery';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const items = await getGalleryItems({
      category: category || undefined,
      includeUnpublished: false,
    });

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Failed to fetch public gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items', items: [] },
      { status: 500 }
    );
  }
}
