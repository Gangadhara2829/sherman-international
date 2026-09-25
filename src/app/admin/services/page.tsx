import React from 'react';
import prisma from '@/lib/prisma';
import ServicesManagerClient from './ServicesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Services query warning:', err);
  }

  return <ServicesManagerClient initialServices={services} />;
}
