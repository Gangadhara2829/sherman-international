import React from 'react';
import prisma from '@/lib/prisma';
import ClientsManagerClient from './ClientsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  let clients: any[] = [];
  try {
    clients = await prisma.proudlyServedClient.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  } catch (err) {
    console.warn('Clients query warning:', err);
  }

  return <ClientsManagerClient initialClients={clients} />;
}
