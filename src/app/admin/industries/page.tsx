import React from 'react';
import prisma from '@/lib/prisma';
import IndustriesManagerClient from './IndustriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminIndustriesPage() {
  let industries: any[] = [];
  try {
    industries = await prisma.industry.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Industries query warning:', err);
  }

  return <IndustriesManagerClient initialIndustries={industries} />;
}
