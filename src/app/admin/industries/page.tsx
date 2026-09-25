import React from 'react';
import prisma from '@/lib/prisma';
import IndustriesManagerClient from './IndustriesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminIndustriesPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return <IndustriesManagerClient initialIndustries={industries} />;
}
