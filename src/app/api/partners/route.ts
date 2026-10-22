import { NextResponse } from 'next/server';
import { getPartners } from '@/lib/partners';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partners = await getPartners({ includeInactive: false });
    return NextResponse.json(partners);
  } catch (error: any) {
    console.error('Error fetching public partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}
