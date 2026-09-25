import React from 'react';
import prisma from '@/lib/prisma';
import EnquiriesManagerClient from './EnquiriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  let enquiries: any[] = [];
  try {
    enquiries = await prisma.enquiry.findMany({
      include: {
        product: {
          select: { name: true, slug: true, category: { select: { slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.warn('Enquiries query warning:', err);
  }

  return <EnquiriesManagerClient initialEnquiries={enquiries} />;
}
