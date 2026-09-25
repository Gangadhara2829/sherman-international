import React from 'react';
import prisma from '@/lib/prisma';
import ContentManagerClient from './ContentManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const contents = await prisma.siteContent.findMany();
  return <ContentManagerClient initialContents={contents} />;
}
