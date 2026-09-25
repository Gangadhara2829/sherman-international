import React from 'react';
import prisma from '@/lib/prisma';
import ServicesManagerClient from './ServicesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return <ServicesManagerClient initialServices={services} />;
}
