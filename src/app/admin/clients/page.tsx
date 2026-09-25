import React from 'react';
import prisma from '@/lib/prisma';
import ClientsManagerClient from './ClientsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const clients = await prisma.proudlyServedClient.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return <ClientsManagerClient initialClients={clients} />;
}
